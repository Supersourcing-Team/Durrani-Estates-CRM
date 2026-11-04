/* prototype: "This screen could not render" banner, shown instead of crashing the whole app. */
import React from 'react';
import { Icon } from '../ui';
import { Modal } from '../ui/modal';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode; kind?: 'page' | 'modal' }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  componentDidCatch(err: Error) { console.error(err); }
  render() {
    const e = this.state.err;
    if (!e) return this.props.children;
    const banner = (
      <div className="bn err"><span><Icon n="alert" s={18} /></span>
        <div><div className="t">{this.props.kind === 'modal' ? 'This pop-up could not open' : 'This screen could not render'}</div><div>{e.message}</div></div></div>
    );
    return this.props.kind === 'modal' ? <Modal title="Error">{banner}</Modal> : banner;
  }
}
