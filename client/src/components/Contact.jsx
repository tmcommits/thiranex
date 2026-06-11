import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else setStatus('error');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section className="contact">
      <h2>Contact</h2>
      <form onSubmit={submit} className="contact-form">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" required />
        <button type="submit">Send</button>
        {status === 'success' && <div className="success">Message sent!</div>}
        {status === 'error' && <div className="error">Failed to send</div>}
      </form>
    </section>
  );
}
