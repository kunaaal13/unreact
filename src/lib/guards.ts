import type { Child } from "./types.ts";

// Check for either null or undefined without rejecting 0 or empty strings.
export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

// Accept non-null objects, but exclude arrays.
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && !isNil(value) && !Array.isArray(value);
}

// Narrow an unknown value to a string.
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

// Check that a handler is callable before using it as an event listener.
export function isFunction(value: unknown): value is EventListener {
  return typeof value === "function";
}

// Treat props beginning with "on", such as onClick, as event handlers.
export function isEventListenerKey(key: string): boolean {
  return key.startsWith("on");
}

// Identify children, which are rendered separately from DOM props.
export function isChildrenKey(key: string): boolean {
  return key === "children";
}

// Strings and numbers become DOM text nodes.
export function isTextNode(node: Child): node is string | number {
  return isString(node) || typeof node === "number";
}

// Inspect the DOM property, not the prop value, to detect boolean fields.
export function isBooleanProperty(element: HTMLElement, key: string): boolean {
  return typeof Reflect.get(element, key) === "boolean";
}

// Accept object-style declarations such as { color: "red" }.
export function isStyleObject(value: unknown): value is Record<string, unknown> {
  return isObject(value);
}

// Find form controls whose live value needs a property update.
export function isFormValueElement(
  element: HTMLElement,
): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  return ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName);
}
