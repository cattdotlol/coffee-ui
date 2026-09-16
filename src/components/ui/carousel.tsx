import { useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { cn } from './cn.ts'
import IconButton from './icon-button.tsx'

export type CarouselProps = {
  label: string
  slides: readonly ReactNode[]
  showIndicators?: boolean
  className?: string
}

export default function Carousel({ label, slides, showIndicators = true, className }: CarouselProps) {
  const id = useId()
  const trackRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  function goTo(next: number) {
    const track = trackRef.current
    const slide = track?.children[next] as HTMLElement | undefined
    if (!track || !slide) return
    track.scrollTo({ left: slide.offsetLeft, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <section aria-roledescription="carousel" aria-label={label} className={cn('grid gap-3', className)}>
      <div className="relative">
        <div
          ref={trackRef}
          id={`${id}-track`}
          onScroll={(event) => {
            const track = event.currentTarget
            setIndex(Math.round(track.scrollLeft / track.clientWidth))
          }}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-panel [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} of ${slides.length}`}
              aria-hidden={slideIndex !== index}
              inert={slideIndex !== index}
              className="w-full shrink-0 snap-start"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <IconButton variant="outline" aria-label="Previous slide" aria-controls={`${id}-track`} disabled={index === 0} onClick={() => goTo(index - 1)}><ChevronLeft strokeWidth={1.5} /></IconButton>
        {showIndicators && (
          <div className="flex items-center gap-1">
            {slides.map((_, slideIndex) => (
              <button
                key={slideIndex}
                type="button"
                aria-label={`Go to slide ${slideIndex + 1}`}
                aria-current={slideIndex === index || undefined}
                aria-controls={`${id}-track`}
                onClick={() => goTo(slideIndex)}
                className="group flex size-6 cursor-pointer items-center justify-center rounded-full pointer-coarse:size-8"
              >
                <span className={cn('h-1.5 rounded-full motion-safe:transition-all', slideIndex === index ? 'w-4 bg-primary' : 'w-1.5 bg-border group-hover:bg-muted')} />
              </button>
            ))}
          </div>
        )}
        <IconButton variant="outline" aria-label="Next slide" aria-controls={`${id}-track`} disabled={index === slides.length - 1} onClick={() => goTo(index + 1)}><ChevronRight strokeWidth={1.5} /></IconButton>
      </div>
    </section>
  )
}
