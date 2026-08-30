"use client";

import { useCallback, useReducer } from "react";
import type { LessonBlock } from "@/lib/types";

/**
 * The module's blocks plus an undo history.
 *
 * Everything that changes a block goes through here, so the three panes can
 * never disagree and every structural change is reversible — including delete.
 */

interface State {
  blocks: LessonBlock[];
  past: LessonBlock[][];
  future: LessonBlock[][];
  /**
   * Which action produced the current state. Consecutive edits to the *same*
   * block coalesce into one history entry, so undo reverses a whole edit rather
   * than one keystroke.
   */
  lastTouched: string | null;
}

type Action =
  | { type: "update"; id: string; patch: Partial<LessonBlock> }
  | { type: "add"; block: LessonBlock }
  | { type: "delete"; id: string }
  | { type: "undo" }
  | { type: "redo" };

const HISTORY_LIMIT = 50;

function push(state: State, blocks: LessonBlock[], touched: string | null): State {
  const coalesce = touched !== null && touched === state.lastTouched;

  return {
    blocks,
    // A coalesced edit keeps the history entry the previous one created.
    past: coalesce
      ? state.past
      : [...state.past, state.blocks].slice(-HISTORY_LIMIT),
    future: [],
    lastTouched: touched,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "update": {
      const blocks = state.blocks.map((block) =>
        block.id === action.id ? { ...block, ...action.patch } : block,
      );
      return push(state, blocks, `update:${action.id}`);
    }

    case "add":
      return push(state, [...state.blocks, action.block], null);

    case "delete":
      return push(
        state,
        state.blocks.filter((block) => block.id !== action.id),
        null,
      );

    case "undo": {
      const previous = state.past.at(-1);
      if (!previous) return state;
      return {
        blocks: previous,
        past: state.past.slice(0, -1),
        future: [state.blocks, ...state.future].slice(0, HISTORY_LIMIT),
        lastTouched: null,
      };
    }

    case "redo": {
      const [next, ...rest] = state.future;
      if (!next) return state;
      return {
        blocks: next,
        past: [...state.past, state.blocks].slice(-HISTORY_LIMIT),
        future: rest,
        lastTouched: null,
      };
    }
  }
}

export function useBlockEditor(initial: LessonBlock[]) {
  const [state, dispatch] = useReducer(reducer, {
    blocks: initial,
    past: [],
    future: [],
    lastTouched: null,
  });

  const updateBlock = useCallback(
    (id: string, patch: Partial<LessonBlock>) =>
      dispatch({ type: "update", id, patch }),
    [],
  );
  const addBlock = useCallback(
    (block: LessonBlock) => dispatch({ type: "add", block }),
    [],
  );
  const deleteBlock = useCallback(
    (id: string) => dispatch({ type: "delete", id }),
    [],
  );
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);

  return {
    blocks: state.blocks,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    updateBlock,
    addBlock,
    deleteBlock,
    undo,
    redo,
  };
}
