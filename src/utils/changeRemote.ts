import { existsSync } from "fs";
import { resolve } from "path";
import { execSync } from "child_process";

export function changeRemote(url: string, path: string) {
  if (existsSync(resolve(path, ".git"))) {
    return execSync(`git remote set-url origin ${url}`, { cwd: path, encoding: "utf8" });
  }
}
