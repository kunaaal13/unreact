import { updateElement } from "./index.ts";
import type { ComponentContext, ComponentFunction } from "./types.ts";
import { setCurrentComponentContext } from "./hooks.ts";

// Each container gets its own persistent component instance.
const componentRegistry = new WeakMap<HTMLElement, ComponentContext>();

// Render a component and keep its previous node for future updates.
export function renderComponent(component: ComponentFunction, container: HTMLElement): void {
  // Reuse this container's persistent component memory.
  let context = componentRegistry.get(container);

  // Create an instance on the first render.
  if (!context) {
    context = {
      component: component,
      node: null,
      hooks: [],
      // Remember how to render this component into its container again.
      rerender: () => renderComponent(component, container),
    };

    componentRegistry.set(container, context);
  }

  let newNode: ReturnType<ComponentFunction>;

  // Hooks use this context while the component runs.
  setCurrentComponentContext(context);

  try {
    // Run the component to describe its next UI.
    newNode = component();
  } finally {
    // Clear the active context even if the component throws.
    setCurrentComponentContext(null);
  }

  // A null previous node inserts DOM; otherwise, diff the existing DOM.
  updateElement(container, newNode, context.node);

  // Save this node for comparison on the next render.
  context.node = newNode;
}
