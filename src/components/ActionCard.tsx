import Link from 'next/link';

export default function ActionCard({ number, title, description, href }: any) {
  return (
    <Link href={href} className="group">
      <div className="bg-zinc-950 dark:bg-zinc-50 border border-zinc-900 dark:border-zinc-200 p-12 h-87.5 flex flex-col justify-between transition-all duration-500 group-hover:border-zinc-500 dark:group-hover:border-zinc-400">
        <div className="space-y-4">
          <span className="text-[10px] font-mono text-zinc-700 dark:text-zinc-400 group-hover:text-zinc-400 dark:group-hover:text-zinc-600 transition-colors duration-300">
            // {number}
          </span>
          <h2 className="text-3xl font-light tracking-tight group-hover:tracking-wide transition-all duration-500 text-white dark:text-black">
            {title}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-500 text-sm leading-relaxed pr-8 group-hover:text-zinc-400 dark:group-hover:text-zinc-600 transition-colors duration-300">
            {description}
          </p>
        </div>
        <div className="text-zinc-800 dark:text-zinc-300 group-hover:text-white dark:group-hover:text-black transition-colors duration-300 text-2xl font-light">
          →
        </div>
      </div>
    </Link>
  );
}