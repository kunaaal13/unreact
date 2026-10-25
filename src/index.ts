import { createElement } from "./lib/index.ts";
import { renderComponent } from "./lib/component.ts";
import { useContext, useEffect, useState } from "./lib/hooks.ts";
import { createContext, createProviderValues } from "./lib/context.ts";

if (import.meta.hot) {
  import.meta.hot.accept();
}

const container = document.getElementById("root")!;

// Create once, outside rendering, so this context keeps the same identity.
const ThemeContext = createContext<"light" | "dark">("light");

function Counter() {
  // Each hook call owns a separate slot; keep their order unchanged.
  const [count, setCount] = useState(0); // Slot 0.
  const [name, setName] = useState("Loki"); // Slot 1.

  // Read supplied theme, or "light" when the scope has no matching value.
  const theme = useContext(ThemeContext);

  // Run initially and when count changes, not when only name changes.
  useEffect(() => {
    document.title = `Count: ${count}`;
    console.log("Effect ran:", count, name);
  }, [count]);

  return createElement(
    "div",
    {},
    createElement("p", {}, `Theme: ${theme}`),
    createElement("button", { onClick: () => setCount((prev) => prev + 1) }, `Count: ${count}`),
    createElement(
      "button",
      { onClick: () => setName((prev) => (prev === "Loki" ? "Thor" : "Loki")) },
      `Name: ${name}`,
    ),
  );
}

// Supply a root scope for now; nested provider nodes are not implemented yet.
const rootValues = createProviderValues(new Map(), ThemeContext, "dark");
renderComponent(Counter, container, rootValues);
