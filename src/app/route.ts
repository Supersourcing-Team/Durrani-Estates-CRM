/* Hash routing, using the prototype's own route table (#agent-lead-1023 -> key agent-lead, params ['1023']). */
import { eng, type RouteDef } from '../engine';

export interface Parsed { key: string; def: RouteDef; params: string[]; hash: string }

export const hashOf = (): string => location.hash.replace(/^#/, '');
export const parseHash = (h = hashOf()): Parsed | null => eng.parse(h);
export const routeKeyOf = (r: Parsed | null): string => (r ? r.key + '|' + r.params.join('-') : 'x');

let lastKey: string | null = null;
/** Page state (UI.pf) belongs to one screen: clear it when the route or its params change. */
export function resetPageStateIfRouteChanged(): boolean {
  const k = routeKeyOf(parseHash());
  if (k === lastKey) return false;
  lastKey = k;
  eng.UI.pf = {};
  return true;
}
