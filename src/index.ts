import { $, type ShellPromise, plugin, which } from "bun";

export type Name = string;
export type Path = string;
export type Filter = RegExp | string;
export type Command = string | string[];
export type Resolver = (path: Path) => Command;
export type Handler = Command | Resolver;
export type Cwd = string;
export type Env = Record<string, string | undefined>;
export type Result = ShellPromise;

export function register(
  name: Name,
  filter?: Filter,
  handler?: Handler,
  cwd?: Cwd,
  env?: Env,
): void {
  filter = filter ?? new RegExp(`\\.${name}$`, "i");
  filter = filter instanceof RegExp ? filter : new RegExp(filter);
  plugin({
    name,
    async setup(build) {
      build.onLoad({ filter }, async ({ path }) => {
        handler = handler ?? name.toLowerCase();
        const exports = await use(path, handler, cwd, env);
        return {
          exports,
          loader: "object",
        };
      });
    },
  });
}

export async function use(
  path: Path,
  handler: Handler,
  cwd?: Cwd,
  env?: Env,
): Promise<object> {
  const { exitCode, stdout, stderr } = await handle(path, handler, cwd, env);

  if (exitCode !== 0) {
    throw new Error(`Enable to use ${path}: ${stderr.toString()}`);
  }

  const data = stdout.toString();

  try {
    const result = JSON.parse(data);
    return typeof result === "object" ? result : { default: result };
  } catch (_) {
    return { default: data };
  }
}

export async function run(
  path: Path,
  handler: Handler,
  cwd?: Cwd,
  env?: Env,
): Promise<void> {
  const { exitCode, stdout, stderr } = await handle(path, handler, cwd, env);

  exitCode === 0
    ? console.log(stdout.toString())
    : console.error(stderr.toString());

  process.exit(exitCode);
}

export async function serve(
  path: Path,
  handler: Handler,
  cwd?: Cwd,
  env?: Env,
): Promise<Response> {
  const { exitCode, stdout, stderr } = await handle(path, handler, cwd, env);

  if (exitCode !== 0) {
    throw new Error(`Enable to serve ${path}: ${stderr.toString()}`);
  }

  const responseString = stdout.toString();
  const [headersString, bodyString] = responseString.split(/\r?\n\r?\n/, 2);
  const headers = new Headers(
    headersString.split(/\r?\n/).map((line: string) => {
      const [name, ...values] = line.split(/:\s+/);
      return [name, values.join(":")];
    }),
  );
  const statusString = headers.get("Status") ?? "200 OK";
  const [statusCode, statusText] = statusString.split(/\s+/, 2);

  return new Response(bodyString ?? "", {
    status: Number(statusCode),
    statusText: statusText ?? "OK",
    headers,
  });
}

export async function handle(
  path: Path,
  handler: Handler,
  cwd?: Cwd,
  env?: Env,
): Promise<ShellPromise> {
  handler = typeof handler === "function" ? handler(path) : handler;
  handler = Array.isArray(handler) ? handler : handler.split(" ");

  const command = which(handler[0]);

  if (!command) {
    throw new Error(`Command (${handler.join(" ")}) not found`);
  }

  const args = handler.slice(1).join(" ");

  if (cwd) {
    $.cwd(cwd);
  }

  if (env) {
    $.env(env);
  }

  const result = await $`${command} ${args} ${path}`.quiet();

  return result;
}
