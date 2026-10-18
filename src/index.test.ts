import { expect, test } from "bun:test";
import { projectName } from "./index.ts";

test("loads the starter module", () => {
  expect(projectName).toBe("unreact");
});
