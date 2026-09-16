import { useState } from 'react'
import { Avatar, Skeleton, Switch } from '@catpkgs/coffee-ui'
import PrimitivePage from '../components/primitive-page.tsx'

const code = `import { Skeleton } from '@catpkgs/coffee-ui'

<div aria-busy={loading}>
  {loading ? (
    <div className="flex items-center gap-3">
      <Skeleton className="size-9 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  ) : <Profile />}
</div>`

export default function SkeletonPage() {
  const [loading, setLoading] = useState(true)
  return (
    <PrimitivePage title="Skeleton" description="A placeholder that previews the layout while content loads. Skeletons are hidden from assistive technology; set aria-busy on the container and announce when content is ready." code={code}>
      <div className="mb-4 max-w-xs"><Switch label="Loading" checked={loading} onCheckedChange={setLoading} /></div>
      <div aria-busy={loading} className="flex min-h-12 items-center gap-3">
        {loading ? <>
          <Skeleton className="size-9 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </> : <>
          <Avatar alt="Ada Lovelace" />
          <div className="text-sm">
            <p className="font-medium">Ada Lovelace</p>
            <p className="text-xs leading-5 text-muted">Wrote the first published algorithm.</p>
          </div>
        </>}
      </div>
      <p role="status" className="sr-only">{loading ? 'Loading profile' : 'Profile loaded'}</p>
    </PrimitivePage>
  )
}
