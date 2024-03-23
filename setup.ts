import { register } from "./src/index.ts";

register("PHP");
register("V", /\.(v|vv|vsh)$/, "v run");
