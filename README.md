# 功能

1. 从 gitlab 上批量 clone 项目到本地。
2. 从本地批量 push 项目到 gitlab

# 配置文件 `./src/config.ts`

配置节点 `gitlab.list` 设置所有需要 clone/push 的项目

# 批量 clone

1. 配置文件：`src/config.ts`

   - `workPath` 设为工作目录
   - `gitlab.host` 设为 gitlab 的地址 `http://192.168.0.19`。centos 上 为 `http://username:token@192.168.0.19`

2. 运行下面命令进行 clone

```
yarn clone-debug
```

# 批量 push

1. 配置文件：`src/config.ts`

   - `workPath` 设为 工作目录
   - `gitlab.host` 设为 gitlab 的地址 `http://192.168.0.19`

2. 运行下面命令进行 push

```
yarn push-debug
```
