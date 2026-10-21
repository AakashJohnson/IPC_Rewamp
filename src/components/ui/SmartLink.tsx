import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';
import { FILE_LABEL } from '../../lib/format';
import { fileKindOf, isExternal } from '../../lib/links';

interface SmartLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** Internal app route */
  to?: string;
  /** Absolute URL */
  href?: string;
  file?: string;
  /** Show a "PDF" style badge for document links */
  badge?: boolean;
  children: ReactNode;
}

/** Routes internal destinations through the router and opens official files / other sites in a new tab. */
export function SmartLink({ to, href, file, badge = false, children, ...rest }: SmartLinkProps) {
  if (to) {
    return <Link to={to} {...rest}>{children}</Link>;
  }
  const kind = file ?? fileKindOf(href);
  const external = isExternal(href);
  return (
    <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {children}
      {badge && kind && <span className="file-badge">{FILE_LABEL[kind] ?? kind.toUpperCase()}</span>}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
