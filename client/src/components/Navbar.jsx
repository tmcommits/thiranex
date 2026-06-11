import React from 'react';

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="brand">Thiranex</div>
        <nav className="links">
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
