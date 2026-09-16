import { ToolCall } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { ToolCall } from '@catpkgs/coffee-ui'

<ToolCall
  name="get_bean_inventory"
  status="success"
  input={{ origin: 'Ethiopia' }}
  output={{ bags: 12, roast: 'light' }}
/>`

export default function ToolCallPage() {
  return (
    <PrimitivePage title="ToolCall" description="Shows a tool the assistant used, with its status, input, and output. Objects are formatted as JSON. Collapsed by default so conversations stay readable." code={code}>
      <div className="max-w-lg space-y-2">
        <ToolCall name="search_recipes" status="running" input={{ method: 'pour-over', servings: 2 }} />
        <ToolCall name="get_bean_inventory" status="success" defaultOpen input={{ origin: 'Ethiopia' }} output={{ bags: 12, roast: 'light', roasted: '2026-09-10' }} />
        <ToolCall name="place_order" status="error" input={{ sku: 'NW-448', quantity: 40 }} error="Supplier API timed out after 10 seconds." />
      </div>
    </PrimitivePage>
  )
}
