import navigationJson from '../content/navigation.json';
import type { LinkItem, Navigation, NavNode } from './types';

export const navigation = navigationJson as Navigation;

/** Flattened view of the curated menu: every node with the chain of ancestors that leads to it. */
interface Located {
  node: NavNode;
  parents: NavNode[];
  /** Top-level menu group (About IPC, Publications & Standards, …) */
  group: NavNode;
}

const located: Located[] = [];
(function walk(nodes: NavNode[], parents: NavNode[], group?: NavNode) {
  for (const node of nodes) {
    const g = group ?? node;
    located.push({ node, parents, group: g });
    if (node.children) walk(node.children, [...parents, node], g);
    for (const col of node.columns ?? []) walk(col.items, [...parents, node], g);
  }
})(navigation.main, []);

/** Some pages appear in more than one menu; the shallowest placement is treated as canonical. */
export function locate(route: string): Located | undefined {
  let best: Located | undefined;
  for (const l of located) {
    if (l.node.to === route && (!best || l.parents.length < best.parents.length)) best = l;
  }
  return best;
}

/** The menu group a route belongs to (used for the active indicator in the primary navigation). */
export function groupOf(route: string): NavNode | undefined {
  if (route === '/') return undefined;
  const exact = locate(route);
  if (exact) return exact.group;
  // Deeper pages (e.g. articles under a section) inherit the group of their closest menu ancestor.
  let best: Located | undefined;
  for (const l of located) {
    const to = l.node.to;
    if (to && to !== '/' && route.startsWith(`${to}/`) && (!best || to.length > (best.node.to?.length ?? 0))) best = l;
  }
  return best?.group;
}

export interface SideNavModel {
  heading: LinkItem;
  items: (LinkItem & { children?: LinkItem[] })[];
}

/**
 * Section navigation for interior pages: the page's own children when it has any, otherwise its
 * siblings under the nearest menu parent. Falls back to the closest ancestor for unlisted articles.
 */
export function sideNavFor(route: string): SideNavModel | undefined {
  let l = locate(route);
  if (!l) {
    let best: Located | undefined;
    for (const c of located) {
      const to = c.node.to;
      if (to && to !== '/' && route.startsWith(`${to}/`) && (!best || to.length > (best.node.to?.length ?? 0))) best = c;
    }
    l = best;
  }
  if (!l) return undefined;
  const node = l.node;
  if (node.children?.length) return { heading: toLink(node), items: node.children };
  const parent = l.parents.at(-1);
  if (parent?.children?.length) return { heading: toLink(parent), items: parent.children };
  // Directly inside a mega-menu column: siblings are the other items in that column.
  const column = parent?.columns?.find(c => c.items.includes(node));
  if (column && column.items.length > 1) return { heading: { label: column.heading }, items: column.items };
  return undefined;
}

const toLink = (n: NavNode): LinkItem => ({ label: n.label, to: n.to, href: n.href });

/** Child links for section landing pages whose own body is empty on the official site. */
export function childrenOf(route: string): NavNode[] {
  return locate(route)?.node.children ?? [];
}
