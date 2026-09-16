import { Citation, Sources } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Citation, Sources } from '@catpkgs/coffee-ui'

const sources = [
  { title: 'Espresso extraction basics', url: 'https://example.com/espresso', description: 'How grind, dose, and time affect taste.' },
]

<p>Grind finer if shots taste sour.<Citation index={1} source={sources[0]} /></p>
<Sources sources={sources} />`

const sources = [
  { title: 'Espresso extraction basics', url: 'https://www.example.com/espresso', description: 'How grind size, dose, yield, and time affect sweetness, acidity, and bitterness.' },
  { title: 'Water temperature for brewing', url: 'https://coffee.example.org/water', description: 'Why most brewing guides recommend water between 90 and 96 °C.' },
  { title: 'Understanding roast levels', url: 'https://roasters.example.net/roasts', description: 'The flavour differences between light, medium, and dark roasts.' },
]

export default function SourcesPage() {
  return (
    <PrimitivePage title="Sources" description="Numbered links to the pages a response is based on, with a preview on hover or focus. Use Citation to mark where each source supports the text." code={code}>
      <div className="max-w-lg space-y-3">
        <p className="text-sm leading-6">
          If your espresso tastes sour, grind finer or pull a longer shot.<Citation index={1} source={sources[0]!} />{' '}
          Keep water between 90 and 96 °C<Citation index={2} source={sources[1]!} />, and remember that lighter roasts often need a little more heat.<Citation index={3} source={sources[2]!} />
        </p>
        <Sources sources={sources} />
      </div>
    </PrimitivePage>
  )
}
