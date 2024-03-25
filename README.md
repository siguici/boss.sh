# Bun's Orchestrator of Scripting Systems (BOSS)

Boss allows you to easily import and execute any type of script file from your JavaScript/TypeScript modules, leveraging the power of Bun.

## 📋 Requirements

Ensure you have the following installed:

- [**Bun**](https://bun.sh/docs/installation): Needed for efficient subprocess execution.


## ⚡️Installation

To install Boss, execute the following command with [Bun](https://bun.sh):

```shell
bun add boss.sh
```

## 🔧 Configuration

Configure Boss in your project by defining the files to import in [the Bun preload file](https://bun.sh/docs/runtime/bunfig#preload):

```typescript
import { register } from "boss.sh";

register('PHP');
register('V', /\.(v|vv|vsh)$/, "v run");
```

## 📖 Usage

Here's how to use Boss in your project:

```typescript
import my_php_module from "my/php/module.php";
import my_v_module from "my/v/module.vsh";

console.log(my_php_module());
console.log(my_v_module());
```

## 👏 Contributions

Contributions are welcome! You can:

- **Open Issues**: Report bugs or suggest improvements.
  
- **Submit Pull Requests**: Contribute bug fixes, new features, or documentation enhancements.
  
- **Provide Feedback**: Share your thoughts and ideas to help improve Boss.

Let's collaborate and make Boss even more awesome together!

## 📄 License

This project is licensed under the MIT License. [See the LICENSE file for more details](./LICENSE.md).
