import type { ComponentContext, StateSetter } from "./types.ts";

// The component whose function is currently running.
let currentComponent: ComponentContext | null = null;

// The next hook slot to read during this render.
let hookIndex = 0;

// Read a persistent state slot and return a setter for that slot.
export function useState<T>(initialValue: T): [T, StateSetter<T>] {
  if (!currentComponent) {
    throw new Error("useState must be called while a component is rendering");
  }

  // Remember which component and slot belong to this hook call.
  const component = currentComponent;
  const index = hookIndex;

  // Initialize once; later renders reuse the stored value.
  if (!(index in component.hooks)) {
    component.hooks[index] = initialValue;
  }

  // Each useState call gets the next slot in this render.
  const value = component.hooks[index] as T;
  hookIndex++;

  // Capture this component and slot; currentComponent is null by click time.
  const setState: StateSetter<T> = (action) => {
    // Read the latest stored state, not the value captured during rendering.
    const previous = component.hooks[index] as T;
    let nextValue: T;

    if (typeof action === "function") {
      // Compute the next value from the latest stored state.
      const updater = action as (previous: T) => T;
      nextValue = updater(previous);
    } else {
      nextValue = action;
    }

    // Compare the resolved value, not the callback itself.
    if (Object.is(previous, nextValue)) return;

    component.hooks[index] = nextValue;

    // Render again using the updated state.
    component.rerender();
  };

  return [value, setState];
}

// Select a component before rendering, or clear it after rendering.
export function setCurrentComponentContext(context: ComponentContext | null): void {
  currentComponent = context;
  // Restart slot tracking without erasing stored hook values.
  hookIndex = 0;
}
