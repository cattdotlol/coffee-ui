import { CodeBlock } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { CodeBlock } from '@catpkgs/coffee-ui'

<CodeBlock code={snippet} language="tsx" />
<CodeBlock code={config} filename="vite.config.ts" showLineNumbers />`

const config = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`

export default function CodeBlockPage() {
  return (
    <PrimitivePage title="CodeBlock" description="Displays code with a copy button, optional filename, and line numbers. It scrolls horizontally instead of wrapping, and is focusable so keyboard users can scroll long lines. The usage examples on every page use it." code={code}>
      <div className="space-y-3">
        <CodeBlock code="pnpm add @catpkgs/coffee-ui" language="bash" />
        <CodeBlock code={config} filename="vite.config.ts" showLineNumbers />
      </div>
    </PrimitivePage>
  )
}
