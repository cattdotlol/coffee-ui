import { useState } from 'react'
import { motion } from 'motion/react'
import { Download, Plus } from 'lucide-react'
import { Avatar, Badge, BarChart, BarList, Button, Card, DonutChart, LineChart, SegmentedControl, Select, Stat, Table, useToast } from '@catpkgs/coffee-ui'
import type { TableColumn } from '@catpkgs/coffee-ui'
import ExampleHeader from './example-header.tsx'

type Range = '7' | '30' | '90'
type Location = 'all' | 'downtown' | 'riverside' | 'airport'

const locations: { value: Location; label: string; share: number; seed: number }[] = [
  { value: 'all', label: 'All locations', share: 1, seed: 7 },
  { value: 'downtown', label: 'Downtown', share: 0.46, seed: 11 },
  { value: 'riverside', label: 'Riverside', share: 0.32, seed: 23 },
  { value: 'airport', label: 'Airport', share: 0.22, seed: 41 },
]

const drinks = ['Flat white', 'Oat latte', 'Cold brew', 'Cortado', 'Espresso']
const drinkWeights = [0.29, 0.24, 0.19, 0.16, 0.12]

function random(seed: number) {
  let state = seed
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

function buildDays(location: Location, count: number) {
  const { share, seed } = locations.find((item) => item.value === location)!
  const next = random(seed)
  const today = new Date()
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (count - 1 - index))
    const weekend = date.getDay() === 0 || date.getDay() === 6 ? 1.22 : 1
    const trend = 1 + (index / count) * 0.12
    const revenue = Math.round(2600 * share * weekend * trend * (0.88 + next() * 0.24))
    const ticket = 6.1 + next() * 0.8
    return { date, revenue, orders: Math.round(revenue / ticket), returning: 0.55 + next() * 0.1 }
  })
}

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const cents = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const compactCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 })
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const shortDate = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
const longDate = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' })

function buckets(values: number[], reduce: (group: number[]) => number = sum, count = 12) {
  const size = Math.max(1, Math.floor(values.length / count))
  const length = Math.min(count, values.length)
  return Array.from({ length }, (_, index) => reduce(values.slice(index * size, index === length - 1 ? undefined : (index + 1) * size)))
}

const mean = (values: number[]) => sum(values) / values.length

type Order = { id: string; customer: string; item: string; total: number; status: 'Completed' | 'Preparing' | 'Refunded'; time: string }

const orders: Order[] = [
  { id: '#4821', customer: 'Ada Lovelace', item: 'Oat latte, croissant', total: 11.5, status: 'Preparing', time: '2 min ago' },
  { id: '#4820', customer: 'Grace Hopper', item: 'Cold brew', total: 5.25, status: 'Completed', time: '6 min ago' },
  { id: '#4819', customer: 'Alan Turing', item: 'Flat white ×2', total: 9.8, status: 'Completed', time: '11 min ago' },
  { id: '#4818', customer: 'Katherine Johnson', item: 'Cortado, banana bread', total: 8.75, status: 'Refunded', time: '18 min ago' },
  { id: '#4817', customer: 'Linus Torvalds', item: 'Espresso', total: 3.2, status: 'Completed', time: '24 min ago' },
]

const orderColumns: TableColumn<Order>[] = [
  { key: 'customer', header: 'Customer', cell: (row) => (
    <span className="flex items-center gap-2">
      <Avatar alt={row.customer} size="sm" />
      <span className="min-w-0">
        <span className="block truncate font-medium">{row.customer}</span>
        <span className="block truncate text-xs text-muted">{row.item}</span>
      </span>
    </span>
  ) },
  { key: 'status', header: 'Status', cell: (row) => <Badge dot variant={row.status === 'Refunded' ? 'destructive' : row.status === 'Preparing' ? 'outline' : 'secondary'}>{row.status}</Badge> },
  { key: 'time', header: 'Placed', cell: (row) => <span className="whitespace-nowrap text-muted">{row.time}</span> },
  { key: 'total', header: 'Total', align: 'end', cell: (row) => cents.format(row.total), sortValue: (row) => row.total },
]

export default function DashboardPage() {
  const { toast } = useToast()
  const [range, setRange] = useState<Range>('30')
  const [location, setLocation] = useState<Location>('all')
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const days = Number(range)
  const history = buildDays(location, days * 2)
  const current = history.slice(days)
  const previous = history.slice(0, days)
  const period = `${days} days`

  const revenue = sum(current.map((day) => day.revenue))
  const previousRevenue = sum(previous.map((day) => day.revenue))
  const orderCount = sum(current.map((day) => day.orders))
  const previousOrders = sum(previous.map((day) => day.orders))
  const average = revenue / orderCount
  const previousAverage = previousRevenue / previousOrders
  const returning = sum(current.map((day) => day.returning)) / days
  const previousReturning = sum(previous.map((day) => day.returning)) / days
  const change = (now: number, before: number) => ((now - before) / before) * 100
  const signed = (value: number, suffix: string) => `${value >= 0 ? '+' : '−'}${Math.abs(value).toFixed(1)}${suffix}`

  const chartData = current.map((day) => ({ tick: shortDate.format(day.date), label: longDate.format(day.date), value: day.revenue }))
  const weekCount = Math.max(4, Math.round(days / 7))
  const byLocation = (name: Location) => buildDays(name, weekCount * 7)
  const [downtown, riverside, airport] = [byLocation('downtown'), byLocation('riverside'), byLocation('airport')]
  const weekly = Array.from({ length: weekCount }, (_, week) => ({
    week: shortDate.format(downtown[week * 7]!.date),
    downtown: sum(downtown.slice(week * 7, week * 7 + 7).map((day) => day.revenue)),
    riverside: sum(riverside.slice(week * 7, week * 7 + 7).map((day) => day.revenue)),
    airport: sum(airport.slice(week * 7, week * 7 + 7).map((day) => day.revenue)),
  }))
  const drinkTotals = drinks.map((drink, index) => ({ label: drink, value: Math.round(orderCount * drinkWeights[index]! * 0.62) }))

  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-5xl space-y-5">
      <ExampleHeader
        title="Dashboard"
        description="Sales for a small coffee chain: filters, stat tiles, a revenue chart with a table view, top sellers, and recent orders."
        actions={<>
          <Button variant="outline" size="sm" onClick={() => toast({ title: 'Report exported', description: `Revenue for the last ${period}.`, variant: 'success' })}><Download aria-hidden="true" className="size-3.5" strokeWidth={1.5} />Export</Button>
          <Button size="sm"><Plus aria-hidden="true" className="size-3.5" strokeWidth={1.5} />New order</Button>
        </>}
      />

      <div role="group" aria-label="Filters" className="flex flex-wrap items-center gap-2">
        <SegmentedControl label="Date range" value={range} onValueChange={setRange} options={[
          { value: '7', label: 'Last 7 days' },
          { value: '30', label: 'Last 30 days' },
          { value: '90', label: 'Last 90 days' },
        ]} />
        <div className="w-44">
          <Select label="Location" hideLabel value={location} onValueChange={(value) => setLocation(value as Location)} options={locations} />
        </div>
      </div>

      <section aria-label="Key metrics" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Revenue" value={compactCurrency.format(revenue)} delta={change(revenue, previousRevenue)} deltaLabel={signed(change(revenue, previousRevenue), '%')} comparison={`vs previous ${period}`} trend={buckets(current.map((day) => day.revenue))} />
        <Stat label="Orders" value={compact.format(orderCount)} delta={change(orderCount, previousOrders)} deltaLabel={signed(change(orderCount, previousOrders), '%')} comparison={`vs previous ${period}`} trend={buckets(current.map((day) => day.orders))} />
        <Stat label="Average order" value={`$${average.toFixed(2)}`} delta={change(average, previousAverage)} deltaLabel={signed(change(average, previousAverage), '%')} comparison={`vs previous ${period}`} trend={buckets(current.map((day) => day.revenue / day.orders), mean)} />
        <Stat label="Returning customers" value={`${Math.round(returning * 100)}%`} delta={returning - previousReturning} deltaLabel={signed((returning - previousReturning) * 100, ' pts')} comparison={`vs previous ${period}`} trend={buckets(current.map((day) => day.returning), mean)} />
      </section>

      <section aria-labelledby="revenue-heading" className="rounded-panel border border-border bg-surface p-4 shadow-xs sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="revenue-heading" className="text-base font-semibold">Daily revenue</h2>
            <p className="text-xs text-muted">{locations.find((item) => item.value === location)?.label}, last {period}</p>
          </div>
          <SegmentedControl label="Revenue view" value={view} onValueChange={setView} options={[{ value: 'chart', label: 'Chart' }, { value: 'table', label: 'Table' }]} />
        </div>
        {view === 'chart'
          ? <LineChart label={`Daily revenue, last ${period}`} data={chartData} index="label" series={[{ key: 'value', label: 'Revenue' }]} area formatValue={currency.format} formatTick={(value) => compactCurrency.format(value)} formatIndex={(value, format) => (format === 'short' ? chartData.find((point) => point.label === value)?.tick ?? String(value) : String(value))} />
          : <Table caption="Daily revenue" className="max-h-60 overflow-y-auto" rows={[...current].reverse()} getRowKey={(day) => day.date.toISOString()} columns={[
            { key: 'date', header: 'Date', cell: (day) => longDate.format(day.date), sortValue: (day) => day.date.getTime() },
            { key: 'orders', header: 'Orders', align: 'end', cell: (day) => day.orders.toLocaleString(), sortValue: (day) => day.orders },
            { key: 'revenue', header: 'Revenue', align: 'end', cell: (day) => currency.format(day.revenue), sortValue: (day) => day.revenue },
          ]} />}
      </section>

      <Card title="Revenue by location" description={`Weekly revenue, last ${period === '7 days' ? '4 weeks' : period}`}>
        <BarChart
          label="Weekly revenue by location"
          layout="stacked"
          index="week"
          data={weekly}
          series={[{ key: 'downtown', label: 'Downtown' }, { key: 'riverside', label: 'Riverside' }, { key: 'airport', label: 'Airport' }]}
          formatValue={currency.format}
          formatTick={(value) => compactCurrency.format(value)}
          height={220}
        />
      </Card>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-5">
          <Card title="Top drinks" description={`Cups sold, last ${period}`}>
            <BarList label="Top drinks by cups sold" items={drinkTotals} />
          </Card>
          <Card title="Orders by channel" description={`Share of orders, last ${period}`}>
            <DonutChart label="Orders by channel" totalLabel="Orders" formatValue={(value) => compact.format(value)} data={[
              { label: 'In store', value: Math.round(orderCount * 0.52) },
              { label: 'Mobile app', value: Math.round(orderCount * 0.27) },
              { label: 'Delivery', value: Math.round(orderCount * 0.15) },
              { label: 'Catering', value: Math.round(orderCount * 0.06) },
            ]} />
          </Card>
        </div>
        <Card title="Recent orders" description="Updated a few minutes ago" footer={<Button variant="ghost" size="sm">View all orders</Button>}>
          <Table caption="Recent orders" columns={orderColumns} rows={orders} getRowKey={(row) => row.id} className="-mx-1 border-0 shadow-none" />
        </Card>
      </div>
    </motion.div>
  )
}
