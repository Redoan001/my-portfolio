import { useEffect, useState } from 'react'
import portrait from '../assets/redoan.png'

const name = 'MD. REDOAN'

function Typewriter() {
  const [text, setText] = useState('')

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    let charIndex = 0
    let isDeleting = false
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')

    function tick() {
      charIndex += isDeleting ? -1 : 1
      setText(name.slice(0, charIndex))
      let delay = isDeleting ? 200 : 400
      if (charIndex === name.length) {
        isDeleting = true
        delay = 2000
      } else if (charIndex === 0) {
        isDeleting = false
        delay = 500
      }
      timeout = setTimeout(tick, delay)
    }

    function start() {
      clearTimeout(timeout)
      if (preference.matches) setText(name)
      else {
        charIndex = 0
        isDeleting = false
        tick()
      }
    }
    start()
    preference.addEventListener('change', start)
    return () => {
      clearTimeout(timeout)
      preference.removeEventListener('change', start)
    }
  }, [])

  return <span id="typewriter" className="accent" aria-label={name}><span aria-hidden="true">{text}</span></span>
}

export function Hero() {
  return (
    <header className="hero" id="home">
      <div className="hero-content max-w-[500px]">
        <h1>HELLO I'M <span className="wave-emoji">👋</span></h1>
        <h1><Typewriter /></h1>
        <p className="mb-[30px] text-muted">Professional Video Editor and Motion Graphic Designer with a focus on high-impact results-driven visual content.</p>
        <button type="button" className="btn-hire" onClick={() => { window.location.hash = 'portfolio' }}>View Portfolio</button>
      </div>
      <div className="hero-image"><img src={portrait} alt="Md. Redoan" /></div>
    </header>
  )
}
