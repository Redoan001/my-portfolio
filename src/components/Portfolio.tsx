import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { portfolioCategories, type PortfolioCategory } from '../data/portfolio'

function VideoCategory({ category }: { category: PortfolioCategory }) {
  const track = useRef<HTMLDivElement>(null)
  const scroll = (direction: number) => {
    const element = track.current
    const item = element?.querySelector<HTMLElement>('.portfolio-item')
    if (!element || !item) return
    const gap = parseFloat(getComputedStyle(element).columnGap) || 0
    element.scrollBy({
      left: direction * (item.getBoundingClientRect().width + gap),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }

  return (
    <div className="portfolio-category mb-[40px]">
      <h3>{category.title}</h3>
      <div className="carousel-wrap relative" role="region" aria-label={`${category.title} portfolio`}>
        <div ref={track} className={category.trackClass}>
          {category.videos.map((src, index) => (
            <div className={`portfolio-item ${category.shape}`} key={src}>
              <iframe src={src} title={`${category.title} — project ${index + 1}`} loading="lazy" allowFullScreen />
            </div>
          ))}
        </div>
        <button type="button" className="carousel-btn prev" aria-label={`Previous ${category.title}`} onClick={() => scroll(-1)}><ChevronLeft size={22} aria-hidden="true" /></button>
        <button type="button" className="carousel-btn next" aria-label={`Next ${category.title}`} onClick={() => scroll(1)}><ChevronRight size={22} aria-hidden="true" /></button>
      </div>
    </div>
  )
}

export function Portfolio() {
  return (
    <section className="portfolio px-[10%] pt-[60px] pb-[10px]" id="portfolio">
      <div className="section-header"><h2>My <span>Portfolio</span></h2></div>
      {portfolioCategories.map(category => <VideoCategory key={category.title} category={category} />)}
    </section>
  )
}
