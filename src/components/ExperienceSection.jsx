import { useEffect, useRef, useState } from 'react'
import { content } from '../data/content.js'

const experience = content.experience || []

function getElementProgress(el) {
  if (!el) return 0
  const rect = el.getBoundingClientRect()
  const h = window.innerHeight
  const start = h * 0.9
  const end = h * 0.6
  if (rect.top >= start) return 0
  if (rect.top <= end) return 1
  return Math.max(0, Math.min(1, (start - rect.top) / (start - end)))
}

export default function ExperienceSection({ theme }) {
  const itemRefs = useRef([])
  const [progress, setProgress] = useState(() => experience.map(() => 0))
  const rafRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setProgress(
          itemRefs.current.map((el) => getElementProgress(el))
        )
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

  const textColor = theme === 'dark' ? 'text-white' : 'text-black'
  const subTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  const accentColor = theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
  const lineColor = theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'
  const nodeBg = theme === 'dark' ? 'bg-cyan-400' : 'bg-blue-500'
  const nodeRing = theme === 'dark' ? 'ring-cyan-400/30' : 'ring-blue-500/30'
  const nodeShadow = theme === 'dark' ? 'shadow-cyan-400/20' : 'shadow-blue-500/20'

  if (experience.length === 0) return null

  return (
    <section
      id="experience"
      className="relative z-10"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-28 md:py-44">
        <h2
          className={`text-center text-3xl font-semibold tracking-tight md:text-5xl mb-16 ${textColor}`}
        >
          Experience
        </h2>

        <div className="relative">
          {/* Vertical line (center) */}
          <div
            className={`absolute left-1/2 -translate-x-px top-0 bottom-0 w-px ${lineColor}`}
            aria-hidden
          />

          <div className="flex flex-col gap-10 sm:gap-12">
            {experience.map((item, index) => {
              const p = progress[index] ?? 0
              const isLeft = index % 2 === 0
              const inView = p > 0.5
              return (
                <div
                  key={`${item.role}-${item.company}-${index}`}
                  ref={(el) => { itemRefs.current[index] = el }}
                  className="relative flex items-start"
                  style={{
                    opacity: p,
                    transform: `translateY(${12 * (1 - p)}px)`,
                  }}
                >
                  {/* Left column: content when index is even */}
                  <div className="flex-1 flex justify-end pr-10 sm:pr-12">
                    {isLeft && (
                      <div className="max-w-md text-right py-1">
                        <p className={`text-xs sm:text-sm font-medium ${accentColor}`}>
                          {item.period}
                        </p>
                        <h3 className={`mt-1 text-lg sm:text-xl font-bold tracking-tight ${textColor}`}>
                          {item.role}
                        </h3>
                        <p className={`mt-0.5 text-sm sm:text-base ${subTextColor}`}>
                          {item.company}
                        </p>
                        <p className={`mt-3 text-sm sm:text-base leading-relaxed ${subTextColor}`}>
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Center: node on the line */}
                  <div className="flex-shrink-0 w-6 flex justify-center">
                    <div
                      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${nodeBg} transition-all duration-300 ${inView ? `ring-4 ${nodeRing} shadow-lg ${nodeShadow}` : ''}`}
                      aria-hidden
                    />
                  </div>

                  {/* Right column: content when index is odd */}
                  <div className="flex-1 flex justify-start pl-10 sm:pl-12">
                    {!isLeft && (
                      <div className="max-w-md text-left py-1">
                        <p className={`text-xs sm:text-sm font-medium ${accentColor}`}>
                          {item.period}
                        </p>
                        <h3 className={`mt-1 text-lg sm:text-xl font-bold tracking-tight ${textColor}`}>
                          {item.role}
                        </h3>
                        <p className={`mt-0.5 text-sm sm:text-base ${subTextColor}`}>
                          {item.company}
                        </p>
                        <p className={`mt-3 text-sm sm:text-base leading-relaxed ${subTextColor}`}>
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
