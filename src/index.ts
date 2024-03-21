import { $, plugin, which } from "bun";

export type Name = string;
export type Filter = RegExp | string;
export type Command = string | string[];

export class Loader {
  protected command?: Command;

  constructor(protected filter: Filter) {}

  with(command: Command): this {
    this.command = command;
    return this;
  }

  as(name: Name): void {
    const filter =
      this.filter instanceof RegExp ? this.filter : new RegExp(this.filter);
    const command = this.command ?? name.toLowerCase();
    plugin({
      name,
      async setup(build) {
        const args = Array.isArray(command) ? command : command.split(" ");
        const cmd = which(args[0]);
        const str_args = args.slice(1).join(" ");
        if (!cmd) {
          throw new Error(`${name} command (${cmd}) not found`);
        }
        build.onLoad({ filter }, async ({ path }) => {
          const text = await $`${cmd} ${str_args} ${path}`.text();

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
}

export function use(filter: Filter): Loader {
  return new Loader(filter);
}
