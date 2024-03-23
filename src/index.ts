import { $, plugin, which } from "bun";

export type Name = string;
export type Path = string;
export type Filter = RegExp | string;
export type Command = string | string[];
export type Handler = ({ path: Path, name: Name, filter: Filter }) => Command;
export type Resolver = Command | Handler;

export function register(
  name: Name,
  filter: Filter,
  resolver?: Resolver,
): void {
  filter = filter instanceof RegExp ? filter : new RegExp(filter);
  plugin({
    name,
    async setup(build) {
      build.onLoad({ filter }, async ({ path }) => {
        resolver = resolver ?? name.toLowerCase();
        resolver =
          typeof resolver === "function"
            ? resolver({ path, name, filter })
            : resolver;
        resolver = Array.isArray(resolver) ? resolver : resolver.split(" ");
        const command = which(resolver[0]);
        if (!command) {
          throw new Error(`${name} command (${command}) not found`);
        }
        const args = resolver.slice(1).join(" ");
        const text = await $`${command} ${args} ${path}`.text();

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
