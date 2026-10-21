import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

// Lets the utility bar's हिन्दी link point at the current page's official Hindi counterpart.

const DEFAULT_HI = 'https://www.ipc.gov.in/hi/';

interface PageMeta {
  hiUrl: string;
  setHiUrl: (url: string | undefined) => void;
}

const PageMetaContext = createContext<PageMeta>({ hiUrl: DEFAULT_HI, setHiUrl: () => {} });

export function PageMetaProvider({ children }: { children: ReactNode }) {
  const [hiUrl, set] = useState(DEFAULT_HI);
  const setHiUrl = useCallback((url: string | undefined) => set(url || DEFAULT_HI), []);
  const value = useMemo(() => ({ hiUrl, setHiUrl }), [hiUrl, setHiUrl]);
  return (
    <PageMetaContext.Provider value={value}>
      {children}
    </PageMetaContext.Provider>
  );
}

export const usePageMeta = () => useContext(PageMetaContext);

/** Sets the document title and Hindi counterpart for the current page. */
export function usePageSetup(title: string, hiUrl?: string) {
  const { setHiUrl } = usePageMeta();
  useEffect(() => {
    document.title = title ? `${title} | Indian Pharmacopoeia Commission` : 'Indian Pharmacopoeia Commission';
    setHiUrl(hiUrl);
  }, [title, hiUrl, setHiUrl]);
}
