import { useState } from 'react'

export default function Avatar({ src, name = '', size = 'h-10 w-10' }) {
  const [failed, setFailed] = useState(false)

  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('') || '?'

  if (!src || failed) {
    return (
      <div
        className={`${size} flex shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300`}
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className={`${size} shrink-0 rounded-full bg-indigo-100 dark:bg-slate-700`}
    />
  )
}