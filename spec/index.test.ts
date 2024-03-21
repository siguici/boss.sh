import { expect, it } from "bun:test";
import hello_php from "./hello.php";
import hello_v from "./hello.vsh";

it("should import PHP file", () => {
  expect(hello_php).toBe("Hello PHP!");
});

it("should import V file", () => {
  expect(hello_v).toBe("Hello V!");
});
