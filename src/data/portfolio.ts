import motionGraphics from '../assets/MotionGraphics.png'
import aiExpert from '../assets/AIExpert.png'
import videoEditing from '../assets/VideoEditing.png'
import graphicsDesign from '../assets/GraphicsDesign.png'

export const navigation = [
  { href: '#home', label: 'HOME' },
  { href: '#about-me', label: 'ABOUT ME' },
  { href: '#services', label: 'SERVICES' },
  { href: '#portfolio', label: 'PORTFOLIO' },
  { href: '#contact-me', label: 'CONTACT' },
] as const

export const services = [
  { image: motionGraphics, title: 'Motion Graphics', description: 'Expert In Creating High-Quality, Professional Motion Visuals With Clean And Impactful Storytelling' },
  { image: aiExpert, title: 'AI Expert', description: 'Expert In Delivering High-Quality AI-Powered Visuals, Videos, And Creative Solutions' },
  { image: videoEditing, title: 'Video Editing', description: 'Skilled In Producing Polished, Engaging Videos With Smooth Transitions And A Professional Finish' },
  { image: graphicsDesign, title: 'Graphics Design', description: 'Professional In Creating Clean, Modern, And Visually Strong Designs That Support Brand Identity' },
] as const

export interface PortfolioCategory {
  title: string
  trackClass: string
  shape: 'tall' | 'square' | 'wide'
  videos: readonly string[]
}

export const portfolioCategories: readonly PortfolioCategory[] = [
  {
    title: 'Reels', trackClass: 'grid-reels', shape: 'tall',
    videos: [
      'https://youtube.com/embed/TqOHsgI6kVo?si=0NU_fbL4qA4xc6GO',
      'https://youtube.com/embed/JpMmFwRRDV4?feature=share',
      'https://youtube.com/embed/YftsxbEUmjw?si=kb-1u3ZMoK1mnZEH',
      'https://youtube.com/embed/y68M4Xbpc-I?si=_EgvjRocoyKEv_BD',
      'https://www.youtube.com/embed/8U76P5Y5Amg',
      'https://youtube.com/embed/OZDyN01Igh0?feature=share',
    ],
  },
  {
    title: 'Social Media Ads', trackClass: 'grid-ads', shape: 'square',
    videos: [
      'https://youtube.com/embed/6uinajX1Fzw?si=SWihlCqRV2uDjqIX',
      'https://youtube.com/embed/uI29nBFaZdo?si=vRpDm3RWx2AfdQZj',
      'https://youtube.com/embed/-uCXnvq-urc?si=ytxr0wZhfUzkJ75Y',
      'https://youtube.com/embed/EpcOkuLJFTQ?si=Bpior02yE6r9n_6p',
      'https://youtube.com/embed/kgTHn_uHD9I?feature=share',
      'https://youtube.com/embed/JpfIdg7ZMzI?si=J4CGvUrLcFqnlZ-j',
    ],
  },
  {
    title: 'Promotional Video', trackClass: 'grid-promo', shape: 'wide',
    videos: [
      'https://www.youtube.com/embed/n0LK9XV0oOk?si=OoHJmxiSYETYN-wh',
      'https://www.youtube.com/embed/sZwXZF3l9a4?si=DZIJG2xHzRn_hh0m',
      'https://www.youtube.com/embed/sUUoQXXHCBA?si=iSPAm_cqle2l7KMM',
      'https://www.youtube.com/embed/fe44qk2VWY8?si=J76CMPcRt14Wt-he',
    ],
  },
]
