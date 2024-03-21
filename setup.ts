import { use } from "./src/index.ts";

use(/\.php$/).as("PHP");
use(/\.(v|vv|vsh)$/)
  .with("v run")
  .as("V");
