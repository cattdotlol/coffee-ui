export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path className="fill-on-primary" d="M7 14h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z" />
      <path
        className="stroke-on-primary"
        strokeLinecap="round"
        strokeWidth="2"
        d="M20 16h1.5a2.5 2.5 0 0 1 0 5H20M11.5 6.5c-1 1.25 1 2.25 0 3.5M15.5 6.5c-1 1.25 1 2.25 0 3.5"
      />
    </svg>
  )
}
