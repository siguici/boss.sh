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

it("can serve PHP file", () => {
  const server = Bun.serve({
    async fetch(request: Request, server) {
      const response = await serve(`${import.meta.dir}/hello.php`, "php");
      expect(response).toBeInstanceOf(Response);
    },
  });

  console.log(`Server running at http://localhost:${server.port}`);
});
