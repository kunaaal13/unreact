import { createElement } from "./lib/index.ts";
import { renderComponent } from "./lib/component.ts";
import { useEffect, useState } from "./lib/hooks.ts";

if (import.meta.hot) {
  import.meta.hot.accept();
}

const container = document.getElementById("root")!;

function Counter() {
  // Each hook call owns a separate slot; keep their order unchanged.
  const [count, setCount] = useState(0); // Slot 0.
  const [name, setName] = useState("Loki"); // Slot 1.

  // Run after every DOM update; dependency filtering comes next.
  useEffect(() => {
    document.title = `Count: ${count}`;
    console.log("Effect ran:", count, name);
  }, [count]);

  return createElement(
    "div",
    {},
    createElement("button", { onClick: () => setCount((prev) => prev + 1) }, `Count: ${count}`),
    createElement(
      "button",
      { onClick: () => setName((prev) => (prev === "Loki" ? "Thor" : "Loki")) },
      `Name: ${name}`,
    ),
  );
}

renderComponent(Counter, container);
