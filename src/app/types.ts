import type React from 'react';
/** A screen: receives the route params, e.g. #agent-lead-1023-calls -> ['1023', 'calls']. */
export type ScreenComp = React.FC<{ params: string[] }>;
/** A modal: receives the args from data-open, e.g. "call-log|1023" -> ['1023']. Returns <Modal>. */
export type ModalComp = React.FC<{ args: string[] }>;
export type ScreenMap = Record<string, ScreenComp>;
export type ModalMap = Record<string, ModalComp>;
