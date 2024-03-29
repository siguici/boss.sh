import { serve } from "./src/index.ts";

const server = Bun.serve({
  async fetch(request: Request, server) {
    const url = new URL(request.url);
    const env = {
      REQUEST_METHOD: url.pathname,
    };
    return await serve(`${import.meta.dir}/spec/hello.php`, (path) => [
      "php-cgi",
      path,
    ]);
  },
});

console.log(`Server running at http://localhost:${server.port}`);
