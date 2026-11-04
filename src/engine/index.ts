/*
 * Typed entry point to the prototype engine.
 * Screens import data helpers and rules from here (leadById, leadRisk, money, fd ...).
 * The engine itself is generated and untyped; the registries are re-exported with types below.
 */
import * as E from './engine';

export * from './api';
export { bump, subscribe, getVersion, getToasts, removeToast, openM, closeM, confirmM, toast, render, renderOverlay } from './bridge';

/** Escape hatch for engine values that are not worth typing. */
export const eng: any = E;

export type ActionFn = (args: string[], el?: Element | null) => void;

export interface Crumb { l: string; go?: string }
export interface RouteDef {
  key: string;
  id: string;
  role: 'agent' | 'mgmt' | 'admin' | 'login' | 'client' | 'proto' | 'shared';
  title: string;
  level: 'L1' | 'L2' | 'L3' | string;
  nav?: string;
  crumb?: (params: string[]) => Crumb[];
  sample?: string[][];
}
export interface ModalDef {
  key: string;
  id: string;
  role: string;
  init?: (args: string[]) => Record<string, any>;
}

/** All actions (the prototype's A registry). Usually triggered through data-act attributes. */
export const actions = (): Record<string, ActionFn> => (E as any).A;
/** Route definitions: title, breadcrumb, level, navigation key. */
export const routeDefs = (): Record<string, RouteDef> => (E as any).R;
/** Modal definitions: initial form values. */
export const modalDefs = (): Record<string, ModalDef> => (E as any).MD;

/** Live engine state. Read inside components; never cache across renders. */
export const getS = (): any => (E as any).S;
export const getUI = (): any => (E as any).UI;
