import { Mail, MapPin, Phone } from 'lucide-react'
import facebook from '../assets/facebook-icon.png'
import instagram from '../assets/instagram-icon.png'
import twitter from '../assets/twitter-icon.png'
import youtube from '../assets/youtube-icon.png'
import linkedin from '../assets/linkedin-icon.png'
import { ContactForm } from './ContactForm'

const details = [
  { Icon: MapPin, title: 'Address', value: 'Dhaka, Bangladesh' },
  { Icon: Mail, title: 'Email', value: 'md40redoan47@gmail.com' },
  { Icon: Phone, title: 'Phone Number', value: '01969502140' },
] as const

// Brand logos stay as the original artwork; Lucide supplies the interface icons.
const socials = [
  { href: 'https://www.facebook.com/redoanbin.rafi', image: facebook, label: 'Facebook' },
  { href: 'https://www.instagram.com/mdredoan01/', image: instagram, label: 'Instagram' },
  { href: 'https://x.com/md_redoan01', image: twitter, label: 'Twitter' },
  { href: 'https://www.youtube.com/@Redoan47', image: youtube, label: 'YouTube' },
  { href: 'https://www.linkedin.com/in/mdredoan', image: linkedin, label: 'LinkedIn' },
] as const

export function Contact() {
  return (
    <section className="contact-me px-[10%] py-[60px]" id="contact-me">
      <div className="contact-grid">
        <div className="contact-info">
          <h2>Contact <span>Me</span></h2>
          <p>Have a project in mind? let's discuss how I can help bring your ideas to life.</p>
          <div className="contact-details mb-[40px]">
            {details.map(({ Icon, title, value }) => (
              <div className="detail-item" key={title}>
                <Icon className="contact-icon" size={30} aria-hidden="true" />
                <div><h4>{title}</h4><p>{value}</p></div>
              </div>
            ))}
          </div>
          <div className="social-media">
            <h4>My Social Handles</h4>
            <div className="social-links">
              {socials.map(({ href, image, label }) => <span key={label}><a href={href}><img src={image} alt={label} /></a>{' '}</span>)}
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  )
}
