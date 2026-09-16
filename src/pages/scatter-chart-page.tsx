import { ScatterChart } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { ScatterChart } from '@catpkgs/coffee-ui'

<ScatterChart
  label="Price and rating by drink"
  x="price"
  y="rating"
  xLabel="Price"
  yLabel="Rating"
  getPointLabel={(drink) => drink.name}
  formatX={(value) => \`$\${value.toFixed(2)}\`}
  series={[
    { label: 'Hot', data: hotDrinks },
    { label: 'Iced', data: icedDrinks },
  ]}
/>`

const hot = [
  { name: 'Espresso', price: 3, rating: 4.4 }, { name: 'Americano', price: 3.5, rating: 4.1 }, { name: 'Flat white', price: 4.5, rating: 4.7 },
  { name: 'Latte', price: 4.75, rating: 4.5 }, { name: 'Mocha', price: 5.25, rating: 4.2 }, { name: 'Chai latte', price: 5, rating: 3.9 },
]
const iced = [
  { name: 'Cold brew', price: 4.5, rating: 4.6 }, { name: 'Iced latte', price: 5, rating: 4.3 }, { name: 'Nitro', price: 5.75, rating: 4.8 },
  { name: 'Iced mocha', price: 5.5, rating: 3.8 }, { name: 'Affogato', price: 6, rating: 4.9 },
]

export default function ScatterChartPage() {
  return (
    <PrimitivePage title="ScatterChart" description="Plot two measures against each other to spot relationships and outliers. Keyboard focus moves through points from left to right, and each point can have its own name." code={code}>
      <ScatterChart
        label="Price and rating by drink"
        x="price"
        y="rating"
        xLabel="Price"
        yLabel="Rating"
        getPointLabel={(drink) => drink.name}
        formatX={(value) => `$${value.toFixed(2)}`}
        formatY={(value) => value.toFixed(1)}
        series={[{ label: 'Hot', data: hot }, { label: 'Iced', data: iced }]}
      />
    </PrimitivePage>
  )
}
