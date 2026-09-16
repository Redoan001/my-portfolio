import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import logo from '../assets/Logo.png'
import { navigation } from '../data/portfolio'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const links = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const breakpoint = window.matchMedia('(max-width: 900px)')
    const onResize = () => { if (!breakpoint.matches) setIsOpen(false) }
    breakpoint.addEventListener('change', onResize)
    return () => breakpoint.removeEventListener('change', onResize)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        menuButton.current?.focus()
      }
      if (event.key === 'Tab') {
        const items = [menuButton.current, ...Array.from(links.current?.querySelectorAll('a') ?? [])]
          .filter((item): item is HTMLButtonElement | HTMLAnchorElement => item !== null)
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <nav aria-label="Main navigation" className="fixed top-0 z-[1000] flex w-full items-center justify-between px-[10%] py-[10px] backdrop-blur-[15px]">
      <div className="logo">
        <a href="#home" aria-label="Md. Redoan home"><img src={logo} alt="Logo" /></a>
      </div>
      <button
        ref={menuButton}
        type="button"
        id="hamburger"
        className="hamburger"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="nav-links"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={30} strokeWidth={2.4} aria-hidden="true" /> : <Menu size={30} strokeWidth={2.4} aria-hidden="true" />}
      </button>
      <ul ref={links} className={`nav-links${isOpen ? ' active' : ''}`} id="nav-links">
        {navigation.map(({ href, label }) => (
          <li key={href}><a href={href} onClick={() => setIsOpen(false)}>{label}</a></li>
        ))}
      </ul>
      <button
        className="btn-hire"
        type="button"
        onClick={() => window.open('https://wa.me/8801969502140?text=Hello Md. Redoan! I saw your portfolio and would like to discuss a project with you.', '_blank', 'noopener,noreferrer')}
      >Let’s Talk</button>
    </nav>
  )
}
