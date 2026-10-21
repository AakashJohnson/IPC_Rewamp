import { Link } from 'react-router';
import { RefreshCw } from 'lucide-react';

/** Shown when a page's content cannot be fetched (offline, server error). */
export function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="container-page py-20">
      <div className="max-w-xl">
        <p className="eyebrow"><span className="rule" aria-hidden />Connection problem</p>
        <h1 className="mt-3 text-h1">This page could not be loaded</h1>
        <p className="mt-4 text-muted">Check your internet connection and try again.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={onRetry} className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-navy-900 px-5 font-semibold text-white hover:bg-navy-800">
            <RefreshCw aria-hidden size={17} /> Try again
          </button>
          <Link to="/" className="inline-flex min-h-12 items-center rounded-sm border border-line-strong bg-white px-5 font-semibold text-navy-900 hover:border-navy-900">Go to home page</Link>
        </div>
      </div>
    </div>
  );
}

/** Router-level error element (unexpected rendering errors). Rendered without the site layout. */
export function RouteError() {
  return (
    <main className="container-page py-20">
      <p className="eyebrow"><span className="rule" aria-hidden />Indian Pharmacopoeia Commission</p>
      <h1 className="mt-3 text-h1">Something went wrong</h1>
      <p className="mt-4 text-muted">An unexpected error occurred while displaying this page.</p>
      <a href="/" className="mt-8 inline-flex min-h-12 items-center rounded-sm bg-navy-900 px-5 font-semibold text-white">Go to home page</a>
    </main>
  );
}
