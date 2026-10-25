import {
  isBooleanProperty,
  isChildrenKey,
  isEventListenerKey,
  isFormValueElement,
  isFunction,
  isNil,
  isString,
  isStyleObject,
  isTextNode,
} from "./guards.ts";
import type { Child, Node } from "./types.ts";
import { getEventName } from "./utils.ts";

export type { Child, Node } from "./types.ts";

// Describe an element without creating any DOM nodes yet.
export function createElement(
  element: Node["element"],
  props: Node["props"],
  ...children: Node["children"]
): Node {
  return { element, props, children };
}

// Undo a prop's effect when it is removed or set to null/undefined.
function removeProp(element: HTMLElement, key: string, value: unknown): void {
  // Children are handled by rendering and diffing, not by DOM attributes.
  if (isChildrenKey(key)) {
    return;
  }

  if (isEventListenerKey(key)) {
    if (isFunction(value)) {
      element.removeEventListener(getEventName(key), value);
    }
    return;
  }

  if (key === "style") {
    element.style.cssText = "";
    return;
  }

  if (key === "className") {
    element.removeAttribute("class");
    return;
  }

  // Removing an attribute alone may leave a form control's live state unchanged.
  if (isBooleanProperty(element, key)) {
    Reflect.set(element, key, false);
  } else if (key === "value" && isFormValueElement(element)) {
    element.value = "";
  }

  element.removeAttribute(key);
}

// Replace an event handler without leaving the previous listener attached.
function updateEventListener(
  element: HTMLElement,
  key: string,
  value: unknown,
  oldValue: unknown,
): void {
  const eventName = getEventName(key);

  // Remove the old function reference before attaching its replacement.
  if (isFunction(oldValue)) {
    element.removeEventListener(eventName, oldValue);
  }

  if (isFunction(value)) {
    element.addEventListener(eventName, value);
  } else if (!isNil(value)) {
    console.warn(`Invalid event handler for ${eventName}:`, value);
  }
}

// Apply CSS text or an object of style declarations.
function setStyle(element: HTMLElement, value: unknown): void {
  // Clear stale declarations before applying the next style object.
  element.style.cssText = isString(value) ? value : "";

  if (!isStyleObject(value)) {
    return;
  }

  for (const [name, styleValue] of Object.entries(value)) {
    const text = isNil(styleValue) ? "" : String(styleValue);

    // Dashed names and CSS custom properties need setProperty; camelCase uses properties.
    if (name.includes("-")) {
      element.style.setProperty(name, text);
    } else {
      Reflect.set(element.style, name, text);
    }
  }
}

// Route a prop to its event, style, DOM property, or attribute handler.
function setProp(element: HTMLElement, key: string, value: unknown, oldValue: unknown): void {
  if (isChildrenKey(key)) {
    return;
  }

  if (isEventListenerKey(key)) {
    updateEventListener(element, key, value, oldValue);
    return;
  }

  // Null and undefined mean removal, not literal attribute strings.
  if (isNil(value)) {
    removeProp(element, key, oldValue);
    return;
  }

  if (key === "style") {
    setStyle(element, value);
    return;
  }

  // The vDOM uses className; HTML uses the class attribute.
  if (key === "className") {
    element.setAttribute("class", String(value));
    return;
  }

  // Keep the boolean property and attribute presence in sync.
  if (isBooleanProperty(element, key)) {
    const enabled = Boolean(value);
    Reflect.set(element, key, enabled);
    element.toggleAttribute(key, enabled);
    return;
  }

  if (key === "value" && isFormValueElement(element)) {
    const text = String(value);
    // Avoid redundant value writes that can disturb the input's cursor.
    if (element.value !== text) {
      element.value = text;
    }
  }

  // Ordinary attributes, including data-* and aria-*, use string values.
  element.setAttribute(key, String(value));
}

// Remove missing props, then apply only new or changed values.
export function updateProps(
  element: HTMLElement,
  newProps: Node["props"],
  oldProps: Node["props"],
): void {
  // Clean up props that no longer exist in the next vDOM node.
  for (const key of Object.keys(oldProps)) {
    if (!(key in newProps)) {
      removeProp(element, key, oldProps[key]);
    }
  }

  // Reference/value equality skips unchanged props.
  for (const key of Object.keys(newProps)) {
    if (newProps[key] !== oldProps[key]) {
      setProp(element, key, newProps[key], oldProps[key]);
    }
  }
}

// Build a real DOM subtree from a vDOM element or text value.
export function createDom(node: Child): HTMLElement | Text {
  if (isTextNode(node)) {
    return document.createTextNode(String(node));
  }

  const element = document.createElement(node.element);
  // An empty previous props object makes every initial prop new.
  updateProps(element, node.props, {});

  // Build descendants in order before returning the completed subtree.
  for (const child of node.children) {
    element.appendChild(createDom(child));
  }

  return element;
}

// Diff one child position; matching elements retain their existing DOM node.
export function updateElement(
  parent: HTMLElement,
  newNode: Child | null,
  oldNode: Child | null,
  index = 0,
): void {
  const targetNode = parent.childNodes[index];

  // No next node means the existing node should disappear.
  if (isNil(newNode)) {
    if (!isNil(oldNode) && !isNil(targetNode)) {
      parent.removeChild(targetNode);
    }
    return;
  }

  // Insert at this position, or append when there is no target node.
  if (isNil(oldNode) || isNil(targetNode)) {
    parent.insertBefore(createDom(newNode), targetNode ?? null);
    return;
  }

  // Replace changed text or transitions between text and element nodes.
  if (isTextNode(newNode) || isTextNode(oldNode)) {
    if (newNode !== oldNode) {
      parent.replaceChild(createDom(newNode), targetNode);
    }
    return;
  }

  // Different tags require a new subtree rather than a props-only update.
  if (newNode.element !== oldNode.element) {
    parent.replaceChild(createDom(newNode), targetNode);
    return;
  }

  // Matching element vNodes correspond to an existing HTMLElement.
  const element = targetNode as HTMLElement;
  updateProps(element, newNode.props, oldNode.props);

  // Remove trailing children backwards: childNodes is a live collection.
  for (let i = oldNode.children.length - 1; i >= newNode.children.length; i--) {
    updateElement(element, null, oldNode.children[i] ?? null, i);
  }

  // Match children by position; nullish fallback preserves 0 and empty strings.
  for (let i = 0; i < newNode.children.length; i++) {
    updateElement(element, newNode.children[i] ?? null, oldNode.children[i] ?? null, i);
  }
}

// Append a new subtree; use updateElement to update an existing one.
export function render(node: Child, container: HTMLElement): void {
  container.appendChild(createDom(node));
}
