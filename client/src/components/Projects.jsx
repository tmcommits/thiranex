import React, { useEffect, useState } from 'react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="projects-grid">Loading...</div>;

  return (
    <div className="projects-grid">
      {projects.map((p) => (
        <article className="card" key={p._id}>
          <div className="card-media">{p.imageUrl ? <img src={p.imageUrl} alt={p.title} /> : <div className="placeholder" />}</div>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <div className="tech">
            {(p.techStack || []).map((t, i) => (
              <span className="chip" key={i}>{t}</span>
            ))}
          </div>
          <div className="links">
            {p.liveUrl && <a href={p.liveUrl} target="_blank">Live</a>}
            {p.githubUrl && <a href={p.githubUrl} target="_blank">Code</a>}
          </div>
        </article>
      ))}
    </div>
  );
}
