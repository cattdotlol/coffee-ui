import { Carousel } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Carousel } from '@catpkgs/coffee-ui'

<Carousel
  label="Featured projects"
  slides={[
    <img src="/one.jpg" alt="Project one" />,
    <img src="/two.jpg" alt="Project two" />,
  ]}
/>`

const slides = [
  { title: 'Calm by default', text: 'Neutral surfaces and quiet borders let content lead.' },
  { title: 'Accessible', text: 'Keyboard support, focus management, and screen reader labels built in.' },
  { title: 'Easy to use', text: 'Simple props, one import, and sensible defaults.' },
]

export default function CarouselPage() {
  return (
    <PrimitivePage title="Carousel" description="A horizontal set of slides with previous, next, and indicator controls. Swipe or scroll on touch devices. Slides are never auto-advanced, and hidden slides are removed from the tab order." code={code}>
      <Carousel label="Highlights" slides={slides.map((slide) => (
        <div key={slide.title} className="flex h-44 flex-col items-center justify-center rounded-panel bg-subtle px-8 text-center">
          <p className="text-base font-semibold">{slide.title}</p>
          <p className="mt-1 max-w-xs text-sm leading-5 text-muted">{slide.text}</p>
        </div>
      ))} />
    </PrimitivePage>
  )
}
