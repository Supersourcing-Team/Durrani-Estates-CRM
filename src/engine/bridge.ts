/*
 * Bridge between the prototype engine and React.
 * The engine calls render(), openM(), toast() and so on after it changes state; here those calls
 * bump a version number that React subscribes to (see src/app/store.ts), so the screens re-render.
 */
import * as E from './engine';

// Live views of engine state (the engine reassigns UI on reset, so always read through the namespace).
const eng = E as any;

type Listener = () => void;
const listeners = new Set<Listener>();
let version = 0;

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
export const getVersion = (): number => version;

/** Ask React to re-render everything that reads engine state. */
export function bump(): void {
  version++;
  listeners.forEach((fn) => fn());
}

/* ---- rendering ---- */
export function render(): void { bump(); }
export function renderOverlay(): void { bump(); }
export function modalRerender(): void { bump(); }

/* ---- modals and confirm dialogs (state lives in UI.m / UI.args / UI.mf / UI.c) ---- */
export function openM(key: string, args?: string[], init?: Record<string, unknown>): void {
  const MD = eng.MD, UI = eng.UI;
  if (!MD[key]) { console.error('modal missing', key); return; }
  UI.m = key;
  UI.args = args || [];
  UI.mf = Object.assign({}, MD[key].init ? MD[key].init(UI.args) : {}, init || {});
  UI.c = null;
  bump();
}
export function closeM(): void {
  const UI = eng.UI;
  UI.m = null; UI.args = []; UI.mf = {}; UI.c = null;
  bump();
}
export function confirmM(c: { title: string; text: string; act: string; ok?: string; danger?: boolean }): void {
  eng.UI.c = c;
  bump();
}

/* ---- toasts ---- */
export interface Toast {
  id: number;
  msg: string;
  kind?: string;
  noTimer?: boolean;
  ttl: number;
  undo?: { label: string; run: () => void };
}
let toastSeq = 0;
let toastList: Toast[] = [];
export const getToasts = (): Toast[] => toastList;

export function removeToast(id: number): void {
  const n = toastList.length;
  toastList = toastList.filter((t) => t.id !== id);
  if (toastList.length !== n) bump();
}
export function _pushToast(t: Omit<Toast, 'id' | 'ttl'> & { ttl?: number }): void {
  const id = ++toastSeq;
  const ttl = t.ttl || 3600;
  toastList = [...toastList, { ...t, id, ttl }];
  setTimeout(() => removeToast(id), ttl);
  bump();
}
export function toast(msg: string, kind?: string): void { _pushToast({ msg, kind }); }
export const _toastCount = (): number => toastList.length;
export function _popToast(): string {
  const t = toastList[toastList.length - 1];
  toastList = toastList.slice(0, -1);
  bump();
  return t ? t.msg : '';
}
export function _markToastNoTimer(): void {
  const t = toastList[toastList.length - 1];
  if (t) { toastList = [...toastList.slice(0, -1), { ...t, noTimer: true }]; bump(); }
}

/* ---- prototype-only DOM helpers: React handles these itself ---- */
export function stageClass(): void {}
export function protoBar(): void {}
export function fitFrame(): void {}
export function paintAv(): void {}
export function labelTables(): void {}
export function inspector(): void {}
