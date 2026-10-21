import { createBrowserRouter, RouterProvider } from 'react-router';
import { MotionConfig } from 'motion/react';
import { A11yProvider } from './lib/a11y';
import { PageMetaProvider } from './lib/page-context';
import { Layout } from './components/layout/Layout';
import { HomePage } from './templates/HomePage';
import { SearchPage } from './templates/SearchPage';
import { ContentRoute } from './templates/ContentRoute';
import { RouteError } from './templates/RouteError';

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: '*', element: <ContentRoute /> },
    ],
  },
]);

export function App() {
  return (
    <A11yProvider>
      <PageMetaProvider>
        {/* "user" honours prefers-reduced-motion for every motion component. */}
        <MotionConfig reducedMotion="user">
          <RouterProvider router={router} />
        </MotionConfig>
      </PageMetaProvider>
    </A11yProvider>
  );
}
