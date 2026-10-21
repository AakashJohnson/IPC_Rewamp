import { useId, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Search } from 'lucide-react';

interface Props {
  className?: string;
  onSubmitted?: () => void;
  size?: 'md' | 'lg';
}

/** Site search across every page title and news headline (client-side over the content manifest). */
export function SearchForm({ className = '', onSubmitted, size = 'md' }: Props) {
  const id = useId();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/search');
    onSubmitted?.();
  };

  return (
    <form role="search" onSubmit={submit} className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">Search the IPC website</label>
      <input
        id={id}
        type="search"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search pages, notices, publications"
        className={`w-full rounded-sm border border-line-strong bg-white pl-4 pr-12 text-ink placeholder:text-muted/80 focus:border-teal-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-teal-600 ${size === 'lg' ? 'h-14 text-[1.0625rem]' : 'h-11 text-[0.9375rem]'}`}
      />
      <button
        type="submit"
        className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-xs text-navy-900 hover:bg-paper"
      >
        <Search aria-hidden size={18} />
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
}
