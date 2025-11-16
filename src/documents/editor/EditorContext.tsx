import { create } from 'zustand';

import { TEditorConfiguration } from './core';

function getInitialConfiguration(): TEditorConfiguration {
  return {
    root: {
      type: 'EmailLayout',
      data: {
        backdropColor: '#F5F5F5',
        canvasColor: '#FFFFFF',
        textColor: '#262626',
        fontFamily: 'MODERN_SANS',
        childrenIds: [],
      },
    },
  };
}

type TValue = {
  document: TEditorConfiguration;

  selectedBlockId: string | null;
  selectedSidebarTab: 'block-configuration' | 'template-fields';
  selectedMainTab: 'editor' | 'preview' | 'json' | 'html';
  selectedScreenSize: 'desktop' | 'mobile';

  inspectorDrawerOpen: boolean;
};

const editorStateStore = create<TValue>(() => ({
  document: getInitialConfiguration(),
  selectedBlockId: null,
  selectedSidebarTab: 'block-configuration',
  selectedMainTab: 'editor',
  selectedScreenSize: 'desktop',

  inspectorDrawerOpen: false,
}));

export function useDocument() {
  return editorStateStore((s) => s.document);
}

export function useSelectedBlockId() {
  return editorStateStore((s) => s.selectedBlockId);
}

export function useSelectedScreenSize() {
  return editorStateStore((s) => s.selectedScreenSize);
}

export function useSelectedMainTab() {
  return editorStateStore((s) => s.selectedMainTab);
}

export function setSelectedMainTab(selectedMainTab: TValue['selectedMainTab']) {
  return editorStateStore.setState({ selectedMainTab });
}

export function useSelectedSidebarTab() {
  return editorStateStore((s) => s.selectedSidebarTab);
}

export function useInspectorDrawerOpen() {
  return editorStateStore((s) => s.inspectorDrawerOpen);
}

export function setSelectedBlockId(selectedBlockId: TValue['selectedBlockId']) {
  const selectedSidebarTab = selectedBlockId === null ? 'block-configuration' : 'block-configuration';
  const inspectorDrawerOpen = selectedBlockId !== null;
  return editorStateStore.setState({
    selectedBlockId,
    selectedSidebarTab,
    inspectorDrawerOpen,
  });
}

export function setSidebarTab(selectedSidebarTab: TValue['selectedSidebarTab']) {
  return editorStateStore.setState({ selectedSidebarTab });
}

export function resetDocument(document: TValue['document'], selectedBlockId?: string | null) {
  const finalSelectedBlockId = selectedBlockId ?? null;
  const selectedSidebarTab = finalSelectedBlockId === null ? 'block-configuration' : 'block-configuration';
  const inspectorDrawerOpen = finalSelectedBlockId !== null;
  return editorStateStore.setState({
    document,
    selectedSidebarTab,
    selectedBlockId: finalSelectedBlockId,
    inspectorDrawerOpen,
  });
}

export function setDocument(document: TValue['document']) {
  const originalDocument = editorStateStore.getState().document;
  return editorStateStore.setState({
    document: {
      ...originalDocument,
      ...document,
    },
  });
}

export function toggleInspectorDrawerOpen() {
  const inspectorDrawerOpen = !editorStateStore.getState().inspectorDrawerOpen;
  return editorStateStore.setState({ inspectorDrawerOpen });
}

export function setSelectedScreenSize(selectedScreenSize: TValue['selectedScreenSize']) {
  return editorStateStore.setState({ selectedScreenSize });
}
