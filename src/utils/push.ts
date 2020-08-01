import { spawn } from "child_process";
import { redBright, greenBright } from "chalk";
import { resolve } from "path";
import { mkdirSync, readFileSync } from "fs";
import { changeRemote } from "./changeRemote";
import { IProject } from "../interface/iProject";

function push(url: string, path: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const p = spawn(`git`, ["push"], { cwd: path });

    p.stdout.on("data", data => {
      console.log(`git push ${url} \n${data}`);
    });
    p.stderr.on("data", data => {
      console.log(`git push ${url} \n${data}`);
    });
    p.on("close", code => {
      if (code !== 0) {
        console.error(redBright(`push ${url}时出错，错误码为: ${code}`));
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

export async function pushAll(pars: { gitlabUrl: string; workPath: string }) {
  const { gitlabUrl, workPath } = pars;
  let successCount = 0;
  let errorCount = 0;

  const list: IProject[] = JSON.parse(readFileSync(resolve(workPath, `config.json`), { encoding: "utf8" }));

  for (let i = 0; i < list.length; i++) {
    const item = list[i].path;
    const url = `${gitlabUrl}/${item}`;
    const path = resolve(workPath, item.replace(/\.git$/, ""));
    mkdirSync(path, { recursive: true });
    changeRemote(url, path);
    if (await push(url, path)) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  if (successCount > 0 && errorCount === 0) {
    console.log(greenBright(`全部成功，共：${list.length}`));
  } else {
    console.log(redBright(`成功：${successCount}，失败：${errorCount}，共：${list.length}`));
  }
}
