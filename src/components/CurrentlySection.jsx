import { useEffect, useRef, useState } from 'react'
import { content } from '../data/content.js'
import ParticleBackground from './ParticleBackground.jsx'

const currently = content.currently || {}
const featuredProject = currently.featuredProject

export default function CurrentlySection({ theme }) {
  const sectionRef = useRef(null)
  const [sectionInView, setSectionInView] = useState(false)
  const textColor = theme === 'dark' ? 'text-white' : 'text-black'
  const subTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  const accentColor = theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
  const backgroundClass = theme === 'dark' ? 'bg-black' : 'bg-white'

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setSectionInView(true)
      },
      { threshold: 0.2, rootMargin: '0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="currently" className={`relative z-10 ${backgroundClass} pb-28 md:pb-44`}>
      <div className="relative z-[2] mx-auto max-w-5xl px-4 sm:px-6 pt-28 md:pt-44" />

      {/* Particle canvas with heading at top */}
      <div className="relative z-[1] w-screen left-1/2 -translate-x-1/2 min-h-[55vh] overflow-hidden">
        <ParticleBackground className="absolute inset-0 z-0" pointSize={3.6} flowLeftToRight />
        <div className="absolute inset-0 z-[1] flex flex-col justify-evenly items-center px-4 py-8 md:py-12 text-center">
          <h2 className={`text-3xl font-semibold tracking-tight md:text-5xl ${textColor}`}>
            Currently Building{' '}
            {featuredProject && (
              <a
                href={featuredProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block ${accentColor} hover:underline`}
              >
                {featuredProject.name.split('').map((char, index) => (
                  <span
                    key={`${char}-${index}`}
                    className={sectionInView ? 'letter-appear inline-block' : 'inline-block opacity-0'}
                    style={sectionInView ? { animationDelay: `${0.15 + index * 0.08}s` } : undefined}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </a>
            )}
          </h2>
          {featuredProject && (
            <p className={`max-w-xl text-sm md:text-base ${subTextColor}`}>
              {featuredProject.description || 'Building in progress. Check back soon.'}
            </p>
          )}
          {featuredProject?.link && (
            <a
              href={featuredProject.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${theme === 'dark' ? 'border-cyan-400/60 text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400/80' : 'border-blue-600/60 text-blue-600 hover:bg-blue-500/15 hover:border-blue-600/80'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Code
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
