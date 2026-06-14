# 一田一策：耕地质量模拟经营平台

这是一个面向中学地理课堂的 React + Vite 前端网页项目。学生通过真实耕地景观图片选择典型区域，读取耕地档案，进行 5 年动态经营模拟，并根据作物、开发强度、治理措施和随机气候事件生成最终经营报告。

项目适合用于“耕地资源与粮食安全”“耕地质量保护”“因地制宜发展农业”等课堂教学场景。

## 快速运行

请先安装 Node.js LTS 版本。

```bash
npm install
npm run dev
```

运行后按终端输出的 Vite 本地预览地址打开即可。

构建和本地预览：

```bash
npm run build
npm run preview
```

构建产物会生成在：

```text
dist/
```

## 页面流程

- 首页：展示项目封面、主标题、课堂定位和教学目标。
- 区域实景图片选择：用真实区域景观卡片选择耕地，并支持土地特征筛选和两区域对比。
- 耕地档案：展示区域实景大图、土地特征、地形、土壤、坡度、气候、适宜作物、风险和治理措施。
- 动态农田模拟：选择作物、开发强度和经营措施，点击“进入下一年”更新指标和农田画面。
- AI 土地诊断员：根据当前指标、区域条件和措施适配性生成诊断建议。
- 经营报告：经营满 5 年或提前结束后，生成产量、肥力、生态健康、措施适配性和最终等级评价。

## 图片资源

所有部署所需图片都已放入项目内部，不依赖本机 D 盘、C 盘或其他绝对路径。

区域图片：

```text
src/assets/regions/
```

对应文件：

- `huabei.jpg`
- `loess_plateau.jpg`
- `sichuan_basin.jpg`
- `songnen.jpg`
- `xinjiang_oasis.jpg`
- `yungui_plateau.jpg`
- `yangtze_plain.jpg`

首页封面图：

```text
src/assets/hero/farmland-cover.png
```

动态农田区域底图：

```text
src/assets/farm-backgrounds/
```

对应文件：

- `huabei_field.png`
- `songnen_field.png`
- `yangtze_plain_field.png`
- `loess_plateau_field.png`
- `yungui_plateau_field.png`
- `xinjiang_oasis_field.png`
- `sichuan_basin_field.png`

区域图片在 `src/data/regions.js` 中通过 Vite 的 `new URL(..., import.meta.url).href` 引用，部署到 Vercel 或 Netlify 后会自动打包。

## 文件结构

```text
geoai_farmland_simulator
├─ package.json
├─ vite.config.js
├─ index.html
├─ README.md
├─ vercel.json
├─ netlify.toml
├─ public
│  ├─ _redirects
│  └─ assets
│     ├─ china-farmland-base-clean.png
│     └─ china-landform-map.jpg
└─ src
   ├─ main.jsx
   ├─ App.jsx
   ├─ styles.css
   ├─ assets
   │  ├─ hero
   │  │  └─ farmland-cover.png
   │  ├─ farm-backgrounds
   │  │  ├─ huabei_field.png
   │  │  ├─ songnen_field.png
   │  │  ├─ yangtze_plain_field.png
   │  │  ├─ loess_plateau_field.png
   │  │  ├─ yungui_plateau_field.png
   │  │  ├─ xinjiang_oasis_field.png
   │  │  └─ sichuan_basin_field.png
   │  └─ regions
   │     ├─ huabei.jpg
   │     ├─ loess_plateau.jpg
   │     ├─ sichuan_basin.jpg
   │     ├─ songnen.jpg
   │     ├─ xinjiang_oasis.jpg
   │     ├─ yungui_plateau.jpg
   │     └─ yangtze_plain.jpg
   ├─ data
   │  ├─ regions.js
   │  ├─ farmlandData.js
   │  ├─ measureEffects.js
   │  ├─ measureConflicts.js
   │  └─ landformRegions.js
   ├─ utils
   │  ├─ simulation.js
   │  └─ measureSelectionRules.js
   └─ components
      ├─ Home.jsx
      ├─ HeroSection.jsx
      ├─ RegionImageSelect.jsx
      ├─ RegionSelect.jsx
      ├─ ChinaFarmlandMap.jsx
      ├─ LandProfile.jsx
      ├─ FarmSimulator.jsx
      ├─ FarmCanvas.jsx
      ├─ ActionPanel.jsx
      ├─ AIDiagnosis.jsx
      ├─ FinalReport.jsx
      └─ MetricBar.jsx
```

## 主要文件作用

- `src/data/regions.js`：主流程使用的区域数据，包含图片、土地特征、土壤、坡度、作物、风险、治理措施和模拟初始指标。
- `src/data/farmlandData.js`：作物、开发强度、经营措施、随机事件和教学目标等基础数据。
- `src/data/measureEffects.js`：不同区域对经营措施的因地制宜评分规则。
- `src/data/measureConflicts.js`：经营措施互斥规则，例如灌溉方式、施肥方式、土地利用状态等。
- `src/data/farmBackgrounds.js`：FarmCanvas 使用的区域动画耕地底图映射。
- `src/data/farmSceneConfigs.js`：FarmCanvas 作物叠加区域、场景类型和区域视觉配置。
- `src/utils/simulation.js`：年度模拟、随机事件、指标变化、AI 诊断和最终报告评价逻辑。
- `src/utils/measureSelectionRules.js`：经营措施选择上限和互斥规则校验。
- `src/components/RegionImageSelect.jsx`：区域图片卡片选择页面，包含筛选和区域对比。
- `src/components/LandProfile.jsx`：耕地档案页面。
- `src/components/FarmSimulator.jsx`：动态农田经营模拟页面。
- `src/components/FarmCanvas.jsx`：根据指标和风险显示动态农田画面。
- `src/components/ActionPanel.jsx`：作物、开发强度和经营措施选择面板。
- `src/components/AIDiagnosis.jsx`：AI 土地诊断员提示面板。
- `src/components/FinalReport.jsx`：最终经营报告页面。
- `src/components/ChinaFarmlandMap.jsx` 与 `src/data/landformRegions.js`：保留的地图实验组件和地形区 path 数据，目前不在主流程中使用。

## GitHub + Vercel / Netlify 自动部署

### 推荐部署方式：GitHub + Vercel

1. 在 GitHub 新建一个仓库。
2. 将本地项目提交到 GitHub：

```bash
git init
git add .
git commit -m "initial deploy"
git branch -M main
git remote add origin <你的 GitHub 仓库地址>
git push -u origin main
```

3. 打开 Vercel。
4. 选择 `Add New Project`。
5. 选择 `Import Git Repository`。
6. 选择刚才的 GitHub 仓库。
7. `Framework Preset` 选择 `Vite`。
8. `Build Command` 填写：

```bash
npm run build
```

9. `Output Directory` 填写：

```text
dist
```

10. 点击 `Deploy`。
11. 部署完成后会获得公网访问链接。

后续更新：

```bash
git add .
git commit -m "update"
git push
```

每次 push 到 GitHub 的 `main` 分支后，Vercel 会自动重新构建并发布生产环境版本。Pull request 或其他分支提交通常会触发 Preview Deployment。

本项目已包含 `vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 备用部署方式：GitHub + Netlify

1. 将项目上传到 GitHub。
2. 打开 Netlify。
3. 选择 `Add new site` → `Import an existing project`。
4. 选择 GitHub 仓库。
5. `Build command` 填写：

```bash
npm run build
```

6. `Publish directory` 填写：

```text
dist
```

7. 点击 `Deploy`。
8. 部署完成后会获得公网访问链接。

后续每次 push 到 GitHub 后，Netlify 会自动重新构建并发布。

本项目已包含 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

同时 `public/_redirects` 中也包含：

```text
/* /index.html 200
```

这些配置用于避免前端路由刷新时出现 404。当前项目主要使用组件状态切换页面，保留这些配置不会影响部署。

## 部署前检查

本项目已经按 Vercel / Netlify 部署要求整理：

- `package.json` 包含 `dev`、`build`、`preview` 脚本。
- `vite.config.js` 使用 `base: "/"`，适合 Vercel / Netlify 根路径部署。
- 图片资源已经放入 `src/assets/` 或 `public/assets/`，没有依赖本地绝对路径。
- `.gitignore` 已排除 `node_modules`、`dist`、`.env`、`.vercel`、`.netlify` 等不应上传的内容。
- 构建产物 `dist/` 不需要提交到 GitHub，部署平台会自动执行 `npm run build`。

建议部署前执行：

```bash
npm install
npm run build
npm run preview
```

确认：

- 首页正常显示；
- Hero 封面图片正常显示；
- 区域图片卡片正常显示；
- 区域选择、耕地档案、动态模拟、经营报告流程正常；
- 没有图片路径报错；
- `dist/` 能正常生成。

## 修改数据的方法

优先修改 `src/data/regions.js`：

- 修改图片：替换 `src/assets/regions/` 中的图片，并在区域对象中调整文件名。
- 调整区域信息：修改 `landFeature`、`soil`、`slope`、`slopeRange`、`slopeImpact`、`climate`、`crops`、`risks` 等字段。
- 调整模拟初始状态：修改区域对象中的 `initial`。
- 调整随机事件概率：修改区域对象中的 `eventWeights`。
- 调整推荐措施：修改 `recommendedMeasures` 和 `suitableMeasures`。

模拟分数会限制在 0 到 100 之间，适合课堂讨论“短期产量”和“长期耕地质量”的关系。
