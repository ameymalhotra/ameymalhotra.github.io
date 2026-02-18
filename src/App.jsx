import { useEffect, useState, useCallback, lazy, Suspense } from 'react'
import { content } from './data/content.js'
import AboutSection from './components/AboutSection.jsx'

const PortfolioLanding = lazy(() => import('./components/PortfolioLanding.jsx'))
import ProjectsSection from './components/ProjectsSection.jsx'
import ExperienceSection from './components/ExperienceSection.jsx'
import ContactSection from './components/ContactSection.jsx'
import CurrentlySection from './components/CurrentlySection.jsx'
import Terminal from './components/Terminal.jsx'

function smoothScrollTo(targetY, duration = 1400) {
  const startY = window.scrollY
  const diff = targetY - startY
  if (Math.abs(diff) < 1) return
  let startTime = null
  let rafId = null

  // Ease-out: quick start, gentle deceleration at the end (no slow ramp-up)
  const ease = (t) => 1 - Math.pow(1 - t, 3)

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = ease(progress)
    window.scrollTo({ top: startY + diff * easedProgress, behavior: 'instant' })
    if (progress < 1) {
      rafId = requestAnimationFrame(step)
    }
  }
  rafId = requestAnimationFrame(step)
}

/**
 * Main App Component
 * Portfolio landing with particle bracket effect.
 */
const theme = 'dark'

export default function App() {
  const [showTerminal, setShowTerminal] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    document.documentElement.classList.add('dark')
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isToggleTerminal = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
      if (isToggleTerminal) {
        event.preventDefault()
        setShowTerminal((prev) => !prev)
        return
      }
      if (event.key === 'Escape') {
        setShowTerminal(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleNavClick = useCallback((e) => {
    const href = e.currentTarget.getAttribute('href')
    if (href && href.startsWith('#')) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY
        smoothScrollTo(y, 1440)
      }
    }
  }, [])

  return (
    <div className="min-h-screen w-full flex flex-col relative bg-black">
      <nav className="fixed top-5 left-1/2 z-20 w-[min(640px,92vw)] -translate-x-1/2 rounded-full border border-white/15 bg-black/35 text-white/95 shadow-2xl shadow-black/40 ring-1 ring-white/5 backdrop-blur-2xl">
        <div className="flex items-center justify-evenly w-full h-12 sm:h-14 px-2 sm:px-6 md:px-10 gap-0 sm:gap-1">
          <a href="#about" onClick={handleNavClick} className="flex items-center justify-center h-full px-2 sm:px-4 text-[13px] sm:text-[15px] font-medium tracking-wide transition-colors duration-200 hover:text-white">
            About
          </a>
          <a href="#currently" onClick={handleNavClick} className="flex items-center justify-center h-full px-2 sm:px-4 text-[13px] sm:text-[15px] font-medium tracking-wide transition-colors duration-200 hover:text-white">
            Now
          </a>
          <a href="#projects" onClick={handleNavClick} className="flex items-center justify-center h-full px-2 sm:px-4 text-[13px] sm:text-[15px] font-medium tracking-wide transition-colors duration-200 hover:text-white">
            Projects
          </a>
          <a href="#experience" onClick={handleNavClick} className="flex items-center justify-center h-full px-2 sm:px-4 text-[13px] sm:text-[15px] font-medium tracking-wide transition-colors duration-200 hover:text-white">
            Exp
            <span className="hidden sm:inline">erience</span>
          </a>
          <a href="#contact" onClick={handleNavClick} className="flex items-center justify-center h-full px-2 sm:px-4 text-[13px] sm:text-[15px] font-medium tracking-wide transition-colors duration-200 hover:text-white">
            Contact
          </a>
          <a
            href={content.resume?.url}
            download={content.resume?.filename}
            className="flex items-center justify-center gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-4 rounded-full border border-blue-400/60 text-blue-400 text-[12px] sm:text-[14px] font-medium tracking-wide transition-all duration-200 hover:bg-blue-400/20 hover:border-blue-400/80 hover:text-white"
            title="Download Resume"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Resume</span>
          </a>
        </div>
      </nav>

      <div id="top" className="min-h-screen">
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
          <PortfolioLanding theme={theme} />
        </Suspense>
      </div>

      <AboutSection theme={theme} />

      <CurrentlySection theme={theme} />

      <ProjectsSection theme={theme} />

      <ExperienceSection theme={theme} />

      <ContactSection />

      {showTerminal && (
        <div className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm">
          <div className="absolute inset-6 rounded-lg overflow-hidden border border-white/10 bg-[#1e1e1e]">
            <Terminal />
          </div>
          <div className="absolute top-6 right-6 text-xs text-white/70">
            Press Esc or Command+K to close
          </div>
        </div>
      )}
    </div>
  )
}
