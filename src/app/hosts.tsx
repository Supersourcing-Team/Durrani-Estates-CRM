/* Overlay hosts: the open modal (UI.m), the confirm dialog (UI.c) and toasts. */
import React from 'react';
import { eng, getToasts, removeToast } from '../engine';
import { Html, Icon } from '../ui';
import { modals } from './registry';
import { ErrorBoundary } from './ErrorBoundary';

export function ModalHost() {
  const UI = eng.UI;
  const ref = React.useRef<HTMLDivElement>(null);
  // prototype: after a failed save, scroll the first error into view
  React.useEffect(() => {
    if (UI.m && UI.mf && UI.mf._e && Object.keys(UI.mf._e).length) {
      const el = ref.current?.querySelector('.err, .bad');
      if (el && (el as HTMLElement).scrollIntoView) try { (el as HTMLElement).scrollIntoView({ block: 'center' }); } catch (_) { /* ignore */ }
    }
  });
  let modal: React.ReactNode = null;
  if (UI.m) {
    const Comp = modals[UI.m];
    modal = Comp
      ? <ErrorBoundary key={UI.m} kind="modal"><Comp args={UI.args || []} /></ErrorBoundary>
      : <ErrorBoundary key="missing" kind="modal"><MissingModal k={UI.m} /></ErrorBoundary>;
  }
  const c = UI.c;
  return (
    <div id="overlay" ref={ref}>
      {modal}
      {c ? (
        <div className="scrim" style={{ zIndex: 100 }} data-act="cbg" role="alertdialog" aria-modal="true">
          <div className="mdl" style={{ maxWidth: 440 }}>
            <div className="mh"><h3><Html html={c.title} /></h3></div>
            <div className="mb"><Html html={c.text} as="div" /></div>
            <div className="mf">
              <button className="btn" type="button" data-act="cclose">Cancel</button>
              <button className={'btn ' + (c.danger ? 'dng' : 'pri')} type="button" data-act={c.act}>{c.ok || 'Confirm'}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MissingModal({ k }: { k: string }): JSX.Element {
  throw new Error('This pop-up is not part of the Agent web app: ' + k);
}

export function ToastHost() {
  const list = getToasts();
  return (
    <div id="toasts" aria-live="polite">
      {list.map((t) => (
        <div key={t.id} className={'toast ' + (t.kind || '') + (t.undo ? ' undo' : '') + (t.noTimer ? ' notimer' : '')} role="status">
          <Icon n={t.kind === 'err' ? 'alert' : 'check'} s={16} />
          <span>{t.msg}</span>
          {t.undo ? (
            <button type="button" className="tundo" aria-label={'Undo: ' + t.undo.label}
              onClick={(e) => { e.stopPropagation(); removeToast(t.id); t.undo!.run(); }}>
              Undo<Icon n="x" s={14} />
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
