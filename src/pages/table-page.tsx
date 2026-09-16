import { useState } from 'react'
import { Badge, Table, TextField, type TableColumn } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Table, Badge } from '@catpkgs/coffee-ui'

<Table
  caption="Invoices"
  rows={invoices}
  getRowKey={(invoice) => invoice.id}
  columns={[
    { key: 'id', header: 'Invoice', cell: (row) => row.id, sortValue: (row) => row.id },
    { key: 'status', header: 'Status', cell: (row) => <Badge>{row.status}</Badge> },
    { key: 'amount', header: 'Amount', align: 'end',
      cell: (row) => \`$\${row.amount.toFixed(2)}\`, sortValue: (row) => row.amount },
  ]}
/>

// Add row selection with checkboxes.
<Table selectable selectedKeys={selected} onSelectionChange={setSelected} … />`

type Invoice = { id: string; customer: string; status: 'Paid' | 'Pending' | 'Failed'; amount: number }

const invoices: Invoice[] = [
  { id: 'INV-1042', customer: 'Northwind', status: 'Paid', amount: 1250 },
  { id: 'INV-1043', customer: 'Globex', status: 'Pending', amount: 320.5 },
  { id: 'INV-1044', customer: 'Initech', status: 'Failed', amount: 89.99 },
  { id: 'INV-1045', customer: 'Umbrella', status: 'Paid', amount: 4800 },
  { id: 'INV-1046', customer: 'Hooli', status: 'Pending', amount: 610 },
]

const columns: TableColumn<Invoice>[] = [
  { key: 'id', header: 'Invoice', cell: (row) => <span className="font-medium">{row.id}</span>, sortValue: (row) => row.id },
  { key: 'customer', header: 'Customer', cell: (row) => row.customer, sortValue: (row) => row.customer },
  { key: 'status', header: 'Status', cell: (row) => <Badge variant={row.status === 'Paid' ? 'default' : row.status === 'Failed' ? 'destructive' : 'secondary'}>{row.status}</Badge> },
  { key: 'amount', header: 'Amount', align: 'end', cell: (row) => `$${row.amount.toFixed(2)}`, sortValue: (row) => row.amount },
]

export default function TablePage() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const rows = invoices.filter((invoice) => `${invoice.id} ${invoice.customer}`.toLowerCase().includes(query.trim().toLowerCase()))
  return (
    <PrimitivePage title="Table" description="Displays rows of structured data. Columns with a sortValue get a sort button that cycles ascending, descending, and unsorted, announced through aria-sort. Wide tables scroll horizontally." code={code}>
      <div className="space-y-4">
        <div className="max-w-xs"><TextField type="search" label="Search invoices" value={query} onValueChange={setQuery} /></div>
        <Table caption="Invoices" columns={columns} rows={rows} getRowKey={(row) => row.id} getRowLabel={(row) => `invoice ${row.id}`} selectable selectedKeys={selected} onSelectionChange={setSelected} empty="No invoices match your search." />
        <p role="status" className="text-sm text-muted">{selected.length ? `${selected.length} selected` : 'No invoices selected.'}</p>
      </div>
    </PrimitivePage>
  )
}
