/* Subscribes React to engine changes: every render()/openM()/toast() in the engine re-renders the app. */
import { useSyncExternalStore } from 'react';
import { subscribe, getVersion } from '../engine/bridge';

export function useEngine(): number {
  return useSyncExternalStore(subscribe, getVersion, getVersion);
}
