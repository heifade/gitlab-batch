import fetch from "node-fetch";
import { IProject } from "../interface/iProject";

/**
 * 从git服务器获取所有项目
 * @param props
 */
export function fetchGitProjects(fetchProjectsUrl: string): Promise<IProject[]> {
  return fetch(fetchProjectsUrl, {
    method: "get",
    compress: true,
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("获取数据失败！");
      }
    })
    .then(list =>
      list.map((n: any) => ({
        id: n.id,
        name: n.name,
        url: n.http_url_to_repo,
        path: `${n.path_with_namespace}.git`
      }))
    );
}

// fetchGitProjects().then(list => {
//   console.log("list", list);
// });
