/*
 * Global event handling, carried over from the prototype unchanged in behaviour:
 *  - one delegated click handler runs data-act / data-open / data-go commands
 *  - inputs rendered from HTML strings (data-m, data-pf, data-bind) still write engine state
 *  - Escape closes the confirm dialog, then the modal, then the notifications dropdown
 *  - Enter in the top search jumps to the leads list with that search
 *  - route changes close modals, reset page state and scroll to the top
 *  - file inputs (data-mfile, data-mfile2, data-pffile, data-cphoto) store the chosen file name
 */
import { eng, actions, toast, openM, closeM, render, renderOverlay } from '../engine';
import { resetPageStateIfRouteChanged } from './route';

function runAct(str: string, el: Element) {
  const p = String(str).split('|');
  const fn = p[0];
  const A = actions();
  if (!A[fn]) { console.error('Missing action', fn); toast('Action not wired: ' + fn, 'err'); return; }
  A[fn](p.slice(1), el);
}

let installed = false;
export function installEvents(): void {
  if (installed) return;
  installed = true;
  const UI = () => eng.UI;

  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLInputElement;
    if (e.key === 'Enter' && t.dataset && t.dataset.tsearch) {
      const [k, r] = t.dataset.tsearch.split('|');
      UI().f = {}; UI().f[k] = t.value; UI().pg = {}; eng.go(r);
    }
  });

  document.addEventListener('click', (e) => {
    const target = e.target as Element;
    if (UI().notif && !target.closest('.dd') && !target.closest('[data-act="notif"]')) { UI().notif = false; render(); }
    const t = target.closest('[data-act],[data-open],[data-go]') as HTMLElement | null;
    if (!t) return;
    if (t.hasAttribute('disabled')) return;
    if (t.dataset.act != null) {
      if (t.dataset.act === 'mbg' || t.dataset.act === 'cbg') { if (target !== t) return; }
      // A cancelled checkbox click makes the browser revert its tick after we re-render, so the box
      // and the stored selection drift apart. Let checkboxes toggle natively; the re-render syncs them.
      if (!(t instanceof HTMLInputElement && t.type === 'checkbox')) e.preventDefault();
      runAct(t.dataset.act, t); return;
    }
    if (t.dataset.open != null) { e.preventDefault(); const p = t.dataset.open.split('|'); openM(p[0], p.slice(1)); return; }
    if (t.dataset.go != null) { e.preventDefault(); if (UI().m) closeM(); UI().notif = false; eng.go(t.dataset.go); return; }
  });

  document.addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement;
    if (!t.dataset) return;
    if (t.dataset.m != null) { UI().mf[t.dataset.m] = t.value; return; }
    if (t.dataset.pf != null) { UI().pf[t.dataset.pf] = t.value; if (t.dataset.pfrr != null) render(); return; }
    if (t.dataset.bind != null && (t.type === 'text' || t.type === 'search' || t.tagName === 'TEXTAREA' || t.type === 'number' || t.type === 'date')) {
      UI().f[t.dataset.bind] = t.value; UI().pg = {}; render();
    }
  });

  document.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (!t.dataset) return;
    if (t.dataset.m != null) { UI().mf[t.dataset.m] = t.type === 'checkbox' ? t.checked : t.value; if (t.dataset.rr) renderOverlay(); return; }
    if (t.dataset.pf != null) { UI().pf[t.dataset.pf] = t.type === 'checkbox' ? t.checked : t.value; if (t.dataset.pfrr != null) render(); return; }
    if (t.dataset.bind != null) { UI().f[t.dataset.bind] = t.value; UI().pg = {}; render(); }
  });

  // File inputs: the prototype keeps only the file name.
  document.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (!t.dataset || !t.files || !t.files[0]) return;
    const f = t.files[0];
    const u = UI();
    if (t.dataset.cphoto) { u.pf.photo = f.name; render(); return; }
    if (t.dataset.mfile) {
      if (f.size > 10 * 1048576) { u.mf._e = Object.assign(u.mf._e || {}, { name: 'File is larger than 10 MB.' }); u.mf.name = ''; }
      else { u.mf.name = f.name; if (u.mf._e) delete u.mf._e.name; }
      renderOverlay(); return;
    }
    if (t.dataset.pffile) {
      if (f.size > 10 * 1048576) { toast('File is larger than 10 MB', 'err'); return; }
      u.pf[t.dataset.pffile] = f.name; if (u.pf._e) delete u.pf._e[t.dataset.pffile]; render(); return;
    }
    if (t.dataset.mfile2) { u.mf.docs = f.name; if (u.mf._e) delete u.mf._e.docs; renderOverlay(); }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const u = UI();
    if (u.c) { u.c = null; renderOverlay(); } else if (u.m) closeM(); else if (u.notif) { u.notif = false; render(); }
  });

  window.addEventListener('hashchange', () => {
    UI().notif = false;
    if (UI().m) closeM();
    if (resetPageStateIfRouteChanged()) window.scrollTo(0, 0);
    render();
  });
}
