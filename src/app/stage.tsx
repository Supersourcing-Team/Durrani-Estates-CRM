/*
 * Stage size (prototype: stageClass). The stylesheet switches layout on #stage.narrow (< 900 px),
 * #stage.mid (< 1180 px) and #stage.phone (< 560 px); components read the same flags from here.
 */
import React from 'react';

export interface StageInfo { narrow: boolean; mid: boolean; phone: boolean; width: number }
const calc = (w: number): StageInfo => ({ narrow: w < 900, mid: w < 1180, phone: w < 560, width: w });

const StageCtx = React.createContext<StageInfo>(calc(typeof window === 'undefined' ? 1440 : window.innerWidth));
export const useStage = () => React.useContext(StageCtx);

/** Renders #stage with the size classes and provides them to children. */
export function Stage({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [info, setInfo] = React.useState<StageInfo>(() => calc(window.innerWidth));
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const update = () => setInfo((p) => { const n = calc(el.clientWidth); return p.width === n.width ? p : n; });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const cls = [info.narrow && 'narrow', info.mid && 'mid', info.phone && 'phone'].filter(Boolean).join(' ');
  return <StageCtx.Provider value={info}><div id="stage" ref={ref} className={cls}>{children}</div></StageCtx.Provider>;
}
