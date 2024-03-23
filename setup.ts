import { register } from "./src/index.ts";

register("PHP", /\.php$/);
register("V", /\.(v|vv|vsh)$/, "v run");
