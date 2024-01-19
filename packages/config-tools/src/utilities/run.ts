import { execaCommandSync } from "execa";

// wrapper around execa to run our command line processes
export const run = (command: string) => {
  return execaCommandSync(command, {
    preferLocal: true,
    shell: true,
    stdio: "inherit"
  });
};
