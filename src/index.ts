import { $, plugin, which } from "bun";

export type Name = string;
export type Path = string;
export type Filter = RegExp | string;
export type Command = string | string[];
export type Handler = (path: Path) => Command;
export type Resolver = Command | Handler;
export type Cwd = string;
export type Env = Record<string, string | undefined>;

export async function load(
  path: Path,
  resolver: Resolver,
  cwd?: Cwd,
  env?: Env,
): Promise<object> {
  resolver = typeof resolver === "function" ? resolver(path) : resolver;
  resolver = Array.isArray(resolver) ? resolver : resolver.split(" ");

  const command = which(resolver[0]);

  if (!command) {
    throw new Error(`Command (${command}) not found`);
  }

  const args = resolver.slice(1).join(" ");

  if (cwd) {
    $.cwd(cwd);
  }

  if (env) {
    $.env(env);
  }

  const { exitCode, stdout, stderr } =
    await $`${command} ${args} ${path}`.quiet();

  if (exitCode !== 0) {
    throw new Error(`Failed to run ${command}: ${stderr.toString()}`);
  }

  return parse(stdout.toString());
}

function parse(data: string): object {
  try {
    const result = JSON.parse(data);
    return typeof result === "object" ? result : { default: result };
  } catch (_) {
    return { default: data };
  }
}

export function register(
  name: Name,
  filter?: Filter,
  resolver?: Resolver,
  cwd?: Cwd,
  env?: Env,
): void {
  filter = filter ?? new RegExp(`\\.${name}$`, "i");
  filter = filter instanceof RegExp ? filter : new RegExp(filter);
  plugin({
    name,
    async setup(build) {
      build.onLoad({ filter }, async ({ path }) => {
        resolver = resolver ?? name.toLowerCase();
        const exports = await load(path, resolver, cwd, env);
        return {
          exports,
          loader: "object",
        };
      });
    },
  });
}
