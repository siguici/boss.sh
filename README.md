# Bun's Orchestrator of Scripting Systems (BOSS)

BOSS (Bun's Orchestrator of Scripting Systems) allows you to easily import and execute any type of script file from your JavaScript/TypeScript modules, leveraging the power of Bun.

## Installation

To install BOSS, execute the following command with [Bun](https://bun.sh):

```shell
bun add boss.sh
```

## Configuration

Configure BOSS in your project by defining the files to import in [the Bun preload file](https://bun.sh/docs/runtime/bunfig#preload):

```typescript
import { register } from "boss.sh";

register('PHP', /\.php$/);
register('V', /\.(v|vv|vsh)$/, "v run");
```

## Usage

Here's how to use BOSS in your project:

```typescript
import my_php_module from "my/php/module.php";
import my_v_module from "my/v/module.vsh";

console.log(my_php_module());
console.log(my_v_module());
```
