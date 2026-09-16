import type { CSSProperties } from 'react'
import portrait from '../assets/redoan.png'

const name = 'MD. REDOAN'

function NameReveal() {
  return (
    <span id="name-reveal" className="accent" aria-label={name}>
      <span aria-hidden="true">
        {Array.from(name).map((character, index) => (
          <span
            className="name-reveal-letter"
            style={{ '--letter-delay': `${180 + index * 48}ms` } as CSSProperties}
            key={`${character}-${index}`}
          >
            {character === ' ' ? '\u00A0' : character}
          </span>
        ))}
      </span>
    </span>
  )
}

export function Hero() {
  return (
    <header className="hero" id="home">
      <div className="hero-content max-w-[500px]">
        <h1>HELLO I'M <span className="wave-emoji">👋</span></h1>
        <h1><NameReveal /></h1>
        <p className="mb-[30px] text-muted">Professional Video Editor and Motion Graphic Designer with a focus on high-impact results-driven visual content.</p>
        <button type="button" className="btn-hire" onClick={() => { window.location.hash = 'portfolio' }}>View Portfolio</button>
      </div>
      <div className="hero-image"><img src={portrait} alt="Md. Redoan" /></div>
    </header>
  )
}
