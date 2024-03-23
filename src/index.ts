import { $, plugin, which } from "bun";

export type Name = string;
export type Path = string;
export type Filter = RegExp | string;
export type Command = string | string[];
export type Handler = (path: Path) => Command;
export type Resolver = Command | Handler;

export async function load(path: Path, resolver: Resolver): Promise<any> {
  resolver = typeof resolver === "function" ? resolver(path) : resolver;
  resolver = Array.isArray(resolver) ? resolver : resolver.split(" ");
  const command = which(resolver[0]);
  if (!command) {
    throw new Error(`Command (${command}) not found`);
  }
  const args = resolver.slice(1).join(" ");
  const { exitCode, stdout, stderr } =
    await $`${command} ${args} ${path}`.quiet();

  if (exitCode !== 0) {
    throw new Error(`Failed to run ${command}: ${stderr.toString()}`);
  }

  const result = stdout.toString();

  try {
    return JSON.parse(result);
  } catch (_) {
    return result;
  }
}

export function register(
  name: Name,
  filter?: Filter,
  resolver?: Resolver,
): void {
  filter = filter ?? new RegExp(`\\.${name}$`, "i");
  filter = filter instanceof RegExp ? filter : new RegExp(filter);
  plugin({
    name,
    async setup(build) {
      build.onLoad({ filter }, async ({ path }) => {
        resolver = resolver ?? name.toLowerCase();
        const result = await load(path, resolver);
        const exports =
          typeof result === "object" ? result : { default: result };
        return {
          exports,
          loader: "object",
        };
      });
    },
  });
}
