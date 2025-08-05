import { basename } from "node:path";

export default {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  process(_sourceText: any, sourcePath: string, _options: any) {
    return {
      code: `module.exports = ${JSON.stringify(basename(sourcePath))};`
    };
  }
};
