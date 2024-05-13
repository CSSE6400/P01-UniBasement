import { PropsWithChildren } from 'react';

function Card({ children }: PropsWithChildren) {
  return (
    <div
      className="group w-full relative flex rounded-2xl bg-zinc-50 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/7.5 group-hover:ring-zinc-900/10 dark:ring-white/10 dark:group-hover:ring-white/20" />
      <div className="rounded-2xl px-4 pb-4 pt-4 w-full">
          {children}
      </div>
    </div>
  )
}

export default Card;