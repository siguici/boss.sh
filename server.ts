import { serve } from "./src/index.ts";

const server = Bun.serve({
  async fetch(request: Request) {
    const url = new URL(request.url);
    const env = {
      REQUEST_METHOD: request.method,
      REQUEST_URI: url.pathname,
    };
    return await serve(`${import.meta.dir}/spec/hello.php`, "php-cgi");
  },
});

console.log(`Server running at http://localhost:${server.port}`);
