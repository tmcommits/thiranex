import { initDb, dbRun, dbGet, dbAll } from './config/db.js';

const runVerification = async () => {
  console.log('Starting programmatic database CRUD verification...');
  
  try {
    // 1. Initialize Tables
    console.log('Step 1: Initializing tables...');
    await initDb();
    
    // Clean potential previous test user to ensure idempotency
    await dbRun('DELETE FROM users WHERE username = ?', ['test_verify_user']);
    
    // 2. Test User Insertion (Registration simulation)
    console.log('Step 2: Testing user creation...');
    const userResult = await dbRun(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      ['test_verify_user', 'test_verify@example.com', 'hashed_test_password']
    );
    console.log(`User created successfully with ID: ${userResult.id}`);
    
    // 3. Test User Fetch (Login / Me simulation)
    console.log('Step 3: Testing user retrieval...');
    const userRow = await dbGet('SELECT * FROM users WHERE id = ?', [userResult.id]);
    if (!userRow || userRow.username !== 'test_verify_user') {
      throw new Error('Failed to retrieve correct user details');
    }
    console.log('User retrieved successfully:', userRow);
    
    // 4. Test Task Insertion (Create Task simulation)
    console.log('Step 4: Testing task creation...');
    const taskResult = await dbRun(
      'INSERT INTO tasks (title, description, status, priority, created_by) VALUES (?, ?, ?, ?, ?)',
      ['Verify Database Integration', 'Write and execute verify_db.js', 'todo', 'high', userResult.id]
    );
    console.log(`Task created successfully with ID: ${taskResult.id}`);
    
    // 5. Test Task Fetch (Get Tasks simulation)
    console.log('Step 5: Testing task retrieval with relations...');
    const taskRow = await dbGet(`
      SELECT t.*, u.username as creator_name
      FROM tasks t
      LEFT JOIN users u ON t.created_by = u.id
      WHERE t.id = ?
    `, [taskResult.id]);
    
    if (!taskRow || taskRow.title !== 'Verify Database Integration' || taskRow.creator_name !== 'test_verify_user') {
      throw new Error('Failed to retrieve correct task details or relations');
    }
    console.log('Task and relations retrieved successfully:', taskRow);
    
    // 6. Test Task Update (Update Task simulation)
    console.log('Step 6: Testing task updating...');
    await dbRun(
      "UPDATE tasks SET status = ?, description = ? WHERE id = ?",
      ['done', 'Completed writing and executing verify_db.js', taskResult.id]
    );
    const updatedTaskRow = await dbGet('SELECT * FROM tasks WHERE id = ?', [taskResult.id]);
    if (!updatedTaskRow || updatedTaskRow.status !== 'done') {
      throw new Error('Failed to update task details');
    }
    console.log('Task updated successfully:', updatedTaskRow);
    
    // 7. Test Task Deletion (Delete Task simulation)
    console.log('Step 7: Testing task deletion...');
    await dbRun('DELETE FROM tasks WHERE id = ?', [taskResult.id]);
    const deletedTaskRow = await dbGet('SELECT * FROM tasks WHERE id = ?', [taskResult.id]);
    if (deletedTaskRow) {
      throw new Error('Task was not deleted');
    }
    console.log('Task deleted successfully.');
    
    // Clean up test user
    await dbRun('DELETE FROM users WHERE id = ?', [userResult.id]);
    console.log('Cleaned up test user.');
    
    console.log('\n=============================================');
    console.log('🎉 Verification successful! All CRUD tests passed.');
    console.log('=============================================');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Verification failed:', err.message);
    process.exit(1);
  }
};

runVerification();
