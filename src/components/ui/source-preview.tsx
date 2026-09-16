import sourceHost from './source-host.ts'

export type Source = {
  title: string
  url: string
  description?: string
}

export default function SourcePreview({ source }: { source: Source }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted">{sourceHost(source.url)}</p>
      <p className="mt-0.5 font-medium leading-5">{source.title}</p>
      {source.description && <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-muted">{source.description}</p>}
    </div>
  )
}
