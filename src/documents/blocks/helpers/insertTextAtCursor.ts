/**
 * Utility functions for inserting text at cursor position in contentEditable elements
 */

/**
 * Inserts text at the current cursor position in a contentEditable element
 * @param text - The text to insert
 * @param element - Optional: the contentEditable element to insert into
 * @returns true if insertion was successful, false otherwise
 */
export function insertTextAtCursor(text: string, element?: HTMLElement): boolean {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return false;
  }

  const range = selection.getRangeAt(0);
  const node = range.commonAncestorContainer;

  // Check if we're in a contentEditable element
  let editableElement = element;
  if (!editableElement) {
    editableElement = node.nodeType === Node.TEXT_NODE
      ? (node.parentElement as HTMLElement)
      : (node as HTMLElement);

    while (editableElement && !editableElement.contentEditable) {
      editableElement = editableElement.parentElement as HTMLElement;
    }
  }

  if (!editableElement || editableElement.contentEditable !== 'true') {
    return false;
  }

  // Delete selected content if any
  range.deleteContents();

  // Create text node and insert
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);

  // Move cursor after inserted text
  range.setStartAfter(textNode);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);

  return true;
}

/**
 * Inserts text at the current cursor position in a textarea or input element
 * @param element - The textarea or input element
 * @param text - The text to insert
 * @returns true if insertion was successful, false otherwise
 */
export function insertTextInTextarea(element: HTMLTextAreaElement | HTMLInputElement, text: string): boolean {
  if (!element) {
    return false;
  }

  const start = element.selectionStart ?? 0;
  const end = element.selectionEnd ?? 0;
  const value = element.value;

  // Insert text at cursor position
  const newValue = value.substring(0, start) + text + value.substring(end);
  element.value = newValue;

  // Move cursor after inserted text
  const newPosition = start + text.length;
  element.setSelectionRange(newPosition, newPosition);

  // Trigger change event
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));

  return true;
}

/**
 * Attempts to insert text at cursor position in either contentEditable or textarea/input
 * @param text - The text to insert
 * @returns true if insertion was successful, false otherwise
 */
export function insertTextAtActiveElement(text: string): boolean {
  const activeElement = document.activeElement as HTMLElement;

  if (!activeElement) {
    return false;
  }

  // Check if it's a textarea or input
  if (activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLInputElement) {
    return insertTextInTextarea(activeElement, text);
  }

  // Check if it's contentEditable
  if (activeElement.contentEditable === 'true') {
    return insertTextAtCursor(text);
  }

  return false;
}

/**
 * Gets the currently focused editable element
 * @returns The focused editable element or null
 */
export function getFocusedEditableElement(): HTMLElement | null {
  const activeElement = document.activeElement as HTMLElement;

  if (!activeElement) {
    return null;
  }

  // Check if it's a textarea or input
  if (activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLInputElement) {
    return activeElement;
  }

  // Check if it's contentEditable
  if (activeElement.contentEditable === 'true') {
    return activeElement;
  }

  return null;
}

