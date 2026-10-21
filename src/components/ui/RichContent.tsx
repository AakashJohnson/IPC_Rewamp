import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router';

/**
 * Renders sanitised CMS HTML (sanitised at build time by scripts/content/build.mjs).
 * Internal links are marked data-internal and handled by the router instead of a full reload.
 */
export function RichContent({ html, className = '' }: { html: string; className?: string }) {
  const navigate = useNavigate();

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement).closest('a[data-internal]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    e.preventDefault();
    navigate(href);
  };

  return <div className={`ipc-prose ${className}`} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
