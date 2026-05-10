import Link from 'next/link';

interface ActionCardProps {
  number: string;
  title: string;
  description: string;
  href: string;
}

export default function ActionCard({ number, title, description, href }: ActionCardProps) {
  return (
    <Link href={href} className="group">
      <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-12 h-87.5 flex flex-col justify-between transition-all duration-500 group-hover:border-zinc-400 dark:group-hover:border-zinc-500">
        <div className="space-y-4">
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-700 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors duration-300">
            {`// ${number}`}
          </span>
          <h2 className="text-3xl font-light tracking-tight group-hover:tracking-wide transition-all duration-500 text-black dark:text-white">
            {title}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-600 text-sm leading-relaxed pr-8 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors duration-300">
            {description}
          </p>
        </div>
        <div className="text-zinc-300 dark:text-zinc-800 group-hover:text-black dark:group-hover:text-white transition-colors duration-300 text-2xl font-light">
          →
        </div>
      </div>
    </Link>
  );
}