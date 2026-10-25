// A virtual element description, separate from the browser's DOM Node type.
export type Node = {
  element: string;
  props: Record<string, unknown>;
  children: (string | number | Node)[];
};

// Each child is either a virtual element or a text value.
export type Child = Node["children"][number];

// A setter accepts either a replacement value or a function of previous state.
export type StateAction<T> = T | ((previous: T) => T);

// Update one state slot and trigger its component's render.
export type StateSetter<T> = (action: StateAction<T>) => void;

// Stop work started by an earlier effect.
export type EffectCleanup = () => void;

// Work to run after the DOM update, optionally returning a cleanup function.
export type EffectCallback = () => void | EffectCleanup;

// Values compared between renders to decide whether an effect should run.
export type EffectDependencies = readonly unknown[];

// Memory stored in an effect's hook slot after the DOM update.
export type EffectState = {
  deps: EffectDependencies | undefined;
  cleanup?: EffectCleanup;
};

// Identify a shared value and its fallback; provider values stay separate.
export type Context<T> = {
  readonly id: symbol;
  readonly defaultValue: T;
};

// A function that produces a virtual element.
export type ComponentFunction = () => Node;

// Persistent memory for one mounted component.
export type ComponentContext = {
  component: ComponentFunction;
  node: Node | null;
  hooks: unknown[];
  // Values supplied by ancestor providers; root instances start empty.
  contextValues: Map<symbol, unknown>;
  // Callbacks collected during rendering, waiting for the DOM update.
  pendingEffects: (() => void)[];
  // Render this instance again after its state changes.
  rerender: () => void;
};
