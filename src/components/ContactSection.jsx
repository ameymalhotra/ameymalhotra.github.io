import { useEffect, useRef, useState } from 'react'
import { content } from '../data/content.js'
import ParticleBackground from './ParticleBackground.jsx'

const contact = content.contact || {}

function getElementProgress(el) {
  if (!el) return 0
  const rect = el.getBoundingClientRect()
  const h = window.innerHeight
  const start = h * 0.85
  const end = h * 0.7
  if (rect.top >= start) return 0
  if (rect.top <= end) return 1
  return Math.max(0, Math.min(1, (start - rect.top) / (start - end)))
}

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/30 transition-colors'
const linkClass =
  'flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-4 transition-colors text-cyan-400 hover:text-white hover:border-cyan-400/30'

export default function ContactSection() {
  const headingRef = useRef(null)
  const formRef = useRef(null)
  const linksRef = useRef(null)
  const [headingProgress, setHeadingProgress] = useState(0)
  const [formProgress, setFormProgress] = useState(0)
  const [linksProgress, setLinksProgress] = useState(0)
  const [formStatus, setFormStatus] = useState('idle') // idle | submitting | success | error
  const rafRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setHeadingProgress(getElementProgress(headingRef.current))
        setFormProgress(getElementProgress(formRef.current))
        setLinksProgress(getElementProgress(linksRef.current))
        rafRef.current = null
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const tagline = contact.tagline || "Let's get in touch and build together."
  const hasLinks = contact.email || contact.github || contact.linkedin
  const hasForm = !!contact.formEndpoint
  const showForm = hasForm && formStatus !== 'success'

  if (!hasLinks && !hasForm) return null

  const headingStyle = {
    opacity: headingProgress,
    transform: `translateY(${20 * (1 - headingProgress)}px)`,
  }
  const formStyle = {
    opacity: formProgress,
    transform: `translateY(${24 * (1 - formProgress)}px)`,
  }
  const linksStyle = {
    opacity: linksProgress,
    transform: `translateY(${24 * (1 - linksProgress)}px)`,
  }

  const linkPills = hasLinks && (
    <>
      {contact.email && (
        <a href={`mailto:${contact.email}`} className={linkClass} aria-label="Email">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium sm:text-base">{contact.email}</span>
        </a>
      )}
      {contact.github && (
        <a href={contact.github} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label="GitHub">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="text-sm font-medium sm:text-base">GitHub</span>
        </a>
      )}
      {contact.linkedin && (
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label="LinkedIn">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span className="text-sm font-medium sm:text-base">LinkedIn</span>
        </a>
      )}
    </>
  )

  async function handleSubmit(e) {
    e.preventDefault()
    if (!contact.formEndpoint || formStatus === 'submitting') return
    setFormStatus('submitting')
    const form = e.target
    const formData = new FormData(form)
    try {
      const res = await fetch(contact.formEndpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setFormStatus('success')
        form.reset()
      } else {
        setFormStatus('error')
      }
    } catch {
      setFormStatus('error')
    }
  }

  return (
    <section id="contact" className="relative z-10 min-h-0 overflow-hidden">
      <ParticleBackground className="absolute inset-0 z-0" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-28 md:py-44">
        <div ref={headingRef} style={headingStyle} className="transition-none mb-12 md:mb-16">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-white md:text-5xl mb-4">
            Contact
          </h2>
          <p className="text-center text-base md:text-lg text-gray-300 md:text-white/80">
            {tagline}
          </p>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/[0.06] backdrop-blur-md shadow-2xl shadow-black/30 p-6 md:p-8">
        {!hasForm ? (
          <div ref={linksRef} style={linksStyle} className="flex flex-wrap justify-center gap-6 sm:gap-8 transition-none">
            {linkPills}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
              {/* Left: Form or success message */}
              <div ref={formRef} style={formStyle} className="transition-none">
                {showForm ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="contact-name" className="sr-only">Name</label>
                      <input id="contact-name" type="text" name="name" required placeholder="Your name" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="sr-only">Email</label>
                      <input id="contact-email" type="email" name="email" required placeholder="you@example.com" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="sr-only">Subject</label>
                      <select id="contact-subject" name="subject" className={inputClass + ' cursor-pointer'}>
                        <option value="Project">Project</option>
                        <option value="Question">Question</option>
                        <option value="Just saying hi">Just saying hi</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="sr-only">Message</label>
                      <textarea id="contact-message" name="message" required rows={4} placeholder="What's on your mind?" className={inputClass + ' resize-y min-h-[100px]'} />
                    </div>
                    <button type="submit" disabled={formStatus === 'submitting'} className="rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 font-medium text-cyan-400 transition-colors hover:bg-cyan-400/20 hover:border-cyan-400/60 disabled:opacity-50 disabled:cursor-not-allowed">
                      {formStatus === 'submitting' ? 'Sending…' : 'Send message'}
                    </button>
                  </form>
                ) : formStatus === 'success' ? (
                  <p className="text-gray-300 text-lg">Thanks — I'll get back to you.</p>
                ) : null}
              </div>

              {/* Right: Or find me here + link pills */}
              <div ref={linksRef} style={linksStyle} className="transition-none">
                {hasLinks && (
                  <>
                    <p className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-6">Or find me here</p>
                    <div className="flex flex-col gap-4">{linkPills}</div>
                  </>
                )}
              </div>
            </div>

            {formStatus === 'error' && (
              <p className="mt-4 text-sm text-red-400">
                Something went wrong. Or email me at{' '}
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="underline hover:text-cyan-400">{contact.email}</a>
                ) : (
                  'your email'
                )}
                .
              </p>
            )}
          </>
        )}
        </div>
      </div>
    </section>
  )
}
