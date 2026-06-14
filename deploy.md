# 部署说明：GitHub + Vercel / Netlify

本项目已经整理为标准 React + Vite 前端项目，可直接部署到 Vercel 或 Netlify。

## 1. 本地检查

在项目根目录执行：

```bash
npm install
npm run build
npm run preview
```

确认构建成功后，项目会生成 `dist/` 目录。`dist/` 不需要提交到 GitHub，部署平台会自动构建。

## 2. 上传到 GitHub

在项目根目录执行：

```bash
git init
git add .
git commit -m "deploy ready"
git branch -M main
git remote add origin <你的 GitHub 仓库地址>
git push -u origin main
```

注意：

- 不要提交 `node_modules/`。
- 不要提交 `.env`。
- `dist/` 已在 `.gitignore` 中排除，通常不需要提交。

## 3. 使用 Vercel 部署

1. 打开 Vercel。
2. 点击 `Add New Project`。
3. 选择并导入你的 GitHub 仓库。
4. Framework Preset 选择 `Vite`。
5. Build Command 填写：

```bash
npm run build
```

6. Output Directory 填写：

```text
dist
```

7. 点击 `Deploy`。

部署完成后，Vercel 会生成公网访问链接，通常形如：

```text
https://你的项目名.vercel.app
```

以后每次修改代码并 push 到 GitHub，Vercel 会自动重新构建并更新公网页面。

## 4. 使用 Netlify 部署

1. 打开 Netlify。
2. 选择 `Add new site` -> `Import an existing project`。
3. 选择你的 GitHub 仓库。
4. Build command 填写：

```bash
npm run build
```

5. Publish directory 填写：

```text
dist
```

6. 点击 `Deploy`。

部署完成后，Netlify 会生成公网访问链接。以后每次 push 到 GitHub，Netlify 会自动重新构建并发布。

## 5. 当前项目部署配置

项目已包含：

- `vite.config.js`：`base: "./"`，`build.outDir: "dist"`。
- `vercel.json`：Vercel 构建命令、输出目录和 SPA fallback。
- `netlify.toml`：Netlify 构建命令、发布目录和重定向。
- `public/_redirects`：Netlify SPA fallback。
- `.gitignore`：排除 `node_modules/`、`dist/`、环境变量和平台缓存目录。

## 6. 公网链接获取方式

公网链接不是本地生成的，而是在部署平台生成：

- Vercel：部署完成后，在项目 Dashboard 的 `Domains` 或部署结果页查看。
- Netlify：部署完成后，在站点 Overview 页面查看。

只要 GitHub 仓库和部署平台保持连接，后续 push 到 `main` 分支后公网链接会自动更新到最新版本。
