import { expect, it } from "bun:test";
import { run, serve } from "boss.sh";
import hello_php from "./hello.php";
import hello_v from "./hello.vsh";

it("should import PHP file", () => {
  expect(hello_php).toBe("Hello PHP!");
});

it("should import V file", () => {
  expect(hello_v).toBe("Hello V!");
});

it("can run V file", () => {
  expect(run(`${import.meta.dir}/hello.vsh`, "v run")).toBeEmpty();
});

it("can serve PHP file", async () => {
  const response = await fetch("http://localhost:3000");
  expect(await response.text()).toEqual("<p>Hello PHP!</p>");
});
