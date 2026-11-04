/*
 * Modal frame (prototype: renderOverlay). Every modal component returns <Modal ...>body</Modal>.
 * On narrow screens it becomes a bottom sheet; `drawer` modals slide in from the right on desktop.
 */
import React from 'react';
import { Icon, type Node } from './core';
import { useStage } from '../app/stage';

export interface ModalProps {
  title: Node;
  sub?: Node;
  foot?: Node;
  size?: '' | 'w' | 'xw' | string;
  drawer?: boolean;
  label?: string;
  children?: Node;
}

export function Modal({ title, sub, foot, size, drawer, label, children }: ModalProps) {
  const { narrow, phone } = useStage();
  const mode = drawer && !narrow ? 'drawer' : narrow ? 'sheet' : '';
  const aria = label || (typeof title === 'string' ? title : undefined);
  return (
    <div className={'scrim ' + mode} data-act="mbg" role="dialog" aria-modal="true" aria-label={aria}>
      <div className={'mdl ' + (size || '') + ' ' + (phone ? 'phone' : '')}>
        <div className="mh">
          <div style={{ minWidth: 0 }}>
            <h3>{title}</h3>
            {sub ? <p className="muted sm" style={{ marginTop: 2 }}>{sub}</p> : null}
          </div>
          <button className="iconbtn" type="button" data-act="mclose" aria-label="Close"><Icon n="x" s={18} /></button>
        </div>
        <div className="mb">{children}</div>
        {foot ? <div className="mf">{foot}</div> : null}
      </div>
    </div>
  );
}
