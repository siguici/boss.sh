import { setup } from "./src/index.ts";

setup("PHP");
setup("V", /\.(v|vv|vsh)$/, "v run");
