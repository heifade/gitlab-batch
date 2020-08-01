import { spawn } from "child_process";
import { redBright, greenBright } from "chalk";
import { resolve } from "path";
import { writeFileSync, existsSync } from "fs";
import { changeRemote } from "./changeRemote";
import { fetchGitProjects } from "../fetch/fetch";
import { clone } from "./clone";

function pull(url: string, path: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const p = spawn(`git`, ["pull"], { cwd: path });

    p.stdout.on("data", data => {
      console.log(`git pull ${url} \n${data}`);
    });
    p.stderr.on("data", data => {
      console.log(`git pull ${url} \n${data}`);
    });
    p.on("close", code => {
      if (code !== 0) {
        console.error(redBright(`pull ${url}时出错，错误码为: ${code}`));
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

export async function pullAll(pars: { gitlabUrl: string; workPath: string; fetchProjectsUrl: string }) {
  const { gitlabUrl, workPath, fetchProjectsUrl } = pars;
  let successCount = 0;
  let errorCount = 0;

  const projectList = await fetchGitProjects(fetchProjectsUrl);

  for (let i = 0; i < projectList.length; i++) {
    const item = projectList[i].path;
    const url = `${gitlabUrl}/${item}`;
    const path = resolve(workPath, item.replace(/\.git$/, ""));

    if (!existsSync(path)) {
      if (await clone(url, path)) {
        successCount++;
      } else {
        errorCount++;
      }
    } else {
      changeRemote(url, path);
      if (await pull(url, path)) {
        successCount++;
      } else {
        errorCount++;
      }
    }
  }

  if (successCount > 0 && errorCount === 0) {
    console.log(greenBright(`全部成功，共：${projectList.length}`));
  } else {
    console.log(redBright(`成功：${successCount}，失败：${errorCount}，共：${projectList.length}`));
  }

  writeFileSync(resolve(workPath, "config.json"), JSON.stringify(projectList, null, 2));
}
