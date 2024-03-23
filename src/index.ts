import { $, plugin, which } from "bun";

export type Name = string;
export type Path = string;
export type Filter = RegExp | string;
export type Command = string | string[];
export type Handler = (path: Path) => Command;
export type Resolver = Command | Handler;

export async function load(path: Path, resolver: Resolver): Promise<string> {
  resolver = typeof resolver === "function" ? resolver(path) : resolver;
  resolver = Array.isArray(resolver) ? resolver : resolver.split(" ");
  const command = which(resolver[0]);
  if (!command) {
    throw new Error(`Command (${command}) not found`);
  }
  const args = resolver.slice(1).join(" ");
  const text = await $`${command} ${args} ${path}`.text();
  return text;
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
        const text = await load(path, resolver);
        return {
          exports: {
            default: text,
          },
          loader: "object",
        };
      });
    },
  });
}
