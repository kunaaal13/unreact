import type { Context } from "./types.ts";

// Create a unique context with a fallback for readers without a provider.
export function createContext<T>(defaultValue: T): Context<T> {
  return {
    id: Symbol("context"),
    defaultValue,
  };
}

// Create a provider's child scope without changing values seen by siblings.
export function createProviderValues<T>(
  parentValues: ReadonlyMap<symbol, unknown>,
  context: Context<T>,
  value: T,
): Map<symbol, unknown> {
  // Inherit existing values, then override only this context in the child scope.
  const childValues = new Map(parentValues);
  childValues.set(context.id, value);

  return childValues;
}
