import { useCallback, useEffect, useRef, useState } from 'react';

interface UndoStackOptions<T> {
  maxSize?: number;
  onStateChange?: (state: T) => void;
}

interface UndoStackResult<T> {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  pushState: (state: T) => void;
  clear: () => void;
}

/**
 * Custom hook for managing undo/redo functionality
 * @param initialState - The initial state
 * @param options - Configuration options
 * @returns Object with undo/redo controls
 */
export function useUndoStack<T>(
  initialState: T,
  options: UndoStackOptions<T> = {}
): UndoStackResult<T> {
  const { maxSize = 50, onStateChange } = options;

  // Use refs to store the stacks to avoid re-renders
  const undoStackRef = useRef<T[]>([]);
  const redoStackRef = useRef<T[]>([]);
  
  // State to trigger re-renders when stack changes
  const [stackVersion, setStackVersion] = useState(0);

  // Clear stacks on unmount or when explicitly called
  const clear = useCallback(() => {
    undoStackRef.current = [];
    redoStackRef.current = [];
    setStackVersion((v) => v + 1);
  }, []);

  // Push a new state onto the undo stack
  const pushState = useCallback(
    (state: T) => {
      // Add current state to undo stack
      undoStackRef.current.push(state);

      // Limit stack size
      if (undoStackRef.current.length > maxSize) {
        undoStackRef.current.shift();
      }

      // Clear redo stack when new state is pushed
      redoStackRef.current = [];

      setStackVersion((v) => v + 1);
    },
    [maxSize]
  );

  // Undo the last change
  const undo = useCallback(() => {
    if (undoStackRef.current.length === 0) {
      return;
    }

    const previousState = undoStackRef.current.pop()!;
    
    // Move to redo stack (we'll need the current state for redo)
    // Note: The caller should pass the current state before calling undo
    
    setStackVersion((v) => v + 1);

    if (onStateChange) {
      onStateChange(previousState);
    }
  }, [onStateChange]);

  // Redo the last undone change
  const redo = useCallback(() => {
    if (redoStackRef.current.length === 0) {
      return;
    }

    const nextState = redoStackRef.current.pop()!;
    
    setStackVersion((v) => v + 1);

    if (onStateChange) {
      onStateChange(nextState);
    }
  }, [onStateChange]);

  // Add current state to redo stack (called before undo)
  const addToRedoStack = useCallback((state: T) => {
    redoStackRef.current.push(state);
    
    // Limit redo stack size
    if (redoStackRef.current.length > maxSize) {
      redoStackRef.current.shift();
    }
  }, [maxSize]);

  return {
    canUndo: undoStackRef.current.length > 0,
    canRedo: redoStackRef.current.length > 0,
    undo: () => {
      // This will be wrapped by the component to add current state to redo
      undo();
    },
    redo,
    pushState,
    clear,
  };
}

/**
 * Enhanced version that handles state management internally
 */
export function useUndoRedoState<T>(
  initialState: T,
  options: UndoStackOptions<T> = {}
): [T, (newState: T) => void, UndoStackResult<T>] {
  const [currentState, setCurrentState] = useState<T>(initialState);
  const { maxSize = 50 } = options;

  const undoStackRef = useRef<T[]>([]);
  const redoStackRef = useRef<T[]>([]);
  const [stackVersion, setStackVersion] = useState(0);

  const clear = useCallback(() => {
    undoStackRef.current = [];
    redoStackRef.current = [];
    setStackVersion((v) => v + 1);
  }, []);

  const setState = useCallback((newState: T) => {
    // Push current state to undo stack before changing
    undoStackRef.current.push(currentState);

    if (undoStackRef.current.length > maxSize) {
      undoStackRef.current.shift();
    }

    // Clear redo stack
    redoStackRef.current = [];

    setCurrentState(newState);
    setStackVersion((v) => v + 1);
  }, [currentState, maxSize]);

  const undo = useCallback(() => {
    if (undoStackRef.current.length === 0) return;

    const previousState = undoStackRef.current.pop()!;
    redoStackRef.current.push(currentState);

    setCurrentState(previousState);
    setStackVersion((v) => v + 1);
  }, [currentState]);

  const redo = useCallback(() => {
    if (redoStackRef.current.length === 0) return;

    const nextState = redoStackRef.current.pop()!;
    undoStackRef.current.push(currentState);

    setCurrentState(nextState);
    setStackVersion((v) => v + 1);
  }, [currentState]);

  const undoRedoControls: UndoStackResult<T> = {
    canUndo: undoStackRef.current.length > 0,
    canRedo: redoStackRef.current.length > 0,
    undo,
    redo,
    pushState: setState,
    clear,
  };

  return [currentState, setState, undoRedoControls];
}

