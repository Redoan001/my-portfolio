import { useRef } from 'react'
import banner from './assets/Banner.png'
import { Navigation } from './components/Navigation'
import { Hero } from './components/Hero'
import { Portfolio } from './components/Portfolio'
import { Contact } from './components/Contact'
import { BackToTop } from './components/BackToTop'
import { ClickEffects } from './components/ClickEffects'
import { services } from './data/portfolio'
import { useSiteEffects } from './hooks/useSiteEffects'

export function App() {
  const root = useRef<HTMLDivElement>(null)
  useSiteEffects(root)

  return (
    <div ref={root}>
      <Navigation />
      <Hero />
      <div className="logo-banner">
        <div className="banner-track">
          <img src={banner} alt="Trusted Clients" />
          <img src={banner} alt="" aria-hidden="true" />
        </div>
      </div>
      <section className="about-me px-[10%] py-[60px]" id="about-me">
        <div className="section-header"><h2>About <span>Me</span></h2></div>
        <div className="about-content">
          <p>
            I’m a highly experienced Motion Graphics Designer and Video Editor with over 5+ years of professional expertise in creating premium visual content for digital and commercial platforms.{' '}
            I specialize in high-impact motion graphics, cinematic video editing, and visually compelling storytelling that strengthens brand identity, boosts audience engagement, and supports clear marketing objectives.{' '}
            My skill set includes advanced proficiency in <span className="accent">Adobe After Effects, Adobe Premiere Pro, Adobe Photoshop, and Adobe Illustrator</span>, along with the strategic use of cutting-edge AI tools for both video and image production to enhance efficiency and creative quality.{' '}
            I have extensive experience collaborating with international clients across global markets and am trusted by US-based and overseas companies for my structured workflow, clear communication, consistent on-time delivery, and ability to transform complex concepts into polished, high-performing visual narratives that deliver measurable brand value.
          </p>
        </div>
      </section>
      <section className="expert-areas px-[5%] py-[60px]" id="services">
        <div className="section-header"><h2>My Expert <span>Areas</span></h2></div>
        <div className="expert-grid">
          {services.map(({ image, title, description }) => (
            <div
              className="expert-card"
              key={title}
              onPointerMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect()
                event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
                event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
              }}
            >
              <img src={image} alt={title} />
              <h4>{title}</h4><p>{description}</p>
            </div>
          ))}
        </div>
      </section>
      <Portfolio />
      <section className="explore-more px-[10%] pt-[10px] pb-[60px] text-center" id="explore">
        <div className="section-header"><h2>Explore <span>More</span></h2></div>
        <div className="explore-btns">
          <button type="button" className="explore-btn" onClick={() => { window.location.href = 'https://www.youtube.com/@Redoan47' }}>Motion Graphics</button>
          <button type="button" className="explore-btn" onClick={() => { window.location.href = 'https://www.behance.net/mdredoan001' }}>Graphic Design</button>
        </div>
      </section>
      <Contact />
      <footer className="border-t border-glass bg-transparent px-[10%] py-[20px] text-center text-muted">
        <p>© <span id="current-year">{new Date().getFullYear()}</span> MD Redoan | All Rights Reserved</p>
      </footer>
      <BackToTop />
      <ClickEffects />
    </div>
  )
}
