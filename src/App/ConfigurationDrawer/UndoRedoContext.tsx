import React, { createContext, useContext } from 'react';
import { EmailLayoutProps } from '../../documents/blocks/EmailLayout/EmailLayoutPropsSchema';

export interface UndoRedoControls {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  pushToUndoStack: (state: EmailLayoutProps) => void;
  startEditing: (state: EmailLayoutProps) => void;
  finishEditing: () => void;
}

const UndoRedoContext = createContext<UndoRedoControls | null>(null);

export function UndoRedoProvider({
  children,
  controls,
}: {
  children: React.ReactNode;
  controls: UndoRedoControls | null;
}) {
  return <UndoRedoContext.Provider value={controls}>{children}</UndoRedoContext.Provider>;
}

export function useUndoRedoControls(): UndoRedoControls | null {
  return useContext(UndoRedoContext);
}

