// Convert an event prop such as onClick to the DOM event name "click".
export function getEventName(key: string): string {
  return key.substring(2).toLowerCase();
}
