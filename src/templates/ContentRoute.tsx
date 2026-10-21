import { Component, Suspense, use, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import aliases from '../content/aliases.json';
import { loadPage } from '../lib/content';
import type { Page } from '../lib/types';
import { ArticleTemplate } from './ArticleTemplate';
import { NewsArticleTemplate } from './NewsArticleTemplate';
import { RegisterTemplate } from './RegisterTemplate';
import { NewsIndexTemplate } from './NewsIndexTemplate';
import { GalleryIndexTemplate, GalleryAlbumTemplate } from './GalleryTemplates';
import { FaqTemplate } from './FaqTemplate';
import { LinksTemplate } from './LinksTemplate';
import { FormTemplate } from './FormTemplate';
import { SiteMapTemplate } from './SiteMapTemplate';
import { NotFound } from './NotFound';
import { LoadError } from './RouteError';
import { PageSkeleton } from './PageSkeleton';

const ALIASES = aliases as Record<string, string>;

function safeDecode(path: string) {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

/** Legacy URLs (…/page.html, trailing slashes, duplicate CMS paths) map onto one canonical route. */
function canonicalRoute(pathname: string): string {
  let route = safeDecode(pathname).replace(/\.html$/i, '');
  if (route.length > 1) route = route.replace(/\/+$/, '');
  if (!route) route = '/';
  return ALIASES[route] ?? route;
}

function PageTemplate({ page }: { page: Page }) {
  switch (page.kind) {
    case 'news': return <NewsArticleTemplate page={page} />;
    case 'article':
    case 'library':
    case 'contact': return <ArticleTemplate page={page} />;
    case 'register': return <RegisterTemplate page={page} />;
    case 'news-index':
    case 'news-archive': return <NewsIndexTemplate page={page} />;
    case 'gallery-index': return <GalleryIndexTemplate page={page} />;
    case 'gallery-album': return <GalleryAlbumTemplate page={page} />;
    case 'faq': return <FaqTemplate page={page} />;
    case 'links': return <LinksTemplate page={page} />;
    case 'form': return <FormTemplate page={page} />;
    case 'sitemap': return <SiteMapTemplate page={page} />;
  }
}

function PageLoader({ route }: { route: string }) {
  const page = use(loadPage(route));
  if (!page) return <NotFound />;
  return <PageTemplate page={page} />;
}

class LoadBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) return <LoadError onRetry={() => this.setState({ error: null })} />;
    return this.props.children;
  }
}

export function ContentRoute() {
  const location = useLocation();
  const route = canonicalRoute(location.pathname);
  if (route !== safeDecode(location.pathname)) {
    return <Navigate to={`${route}${location.search}${location.hash}`} replace />;
  }
  return (
    <LoadBoundary key={route}>
      <Suspense fallback={<PageSkeleton />}>
        <PageLoader route={route} />
      </Suspense>
    </LoadBoundary>
  );
}
