# 部署到 GitHub Pages 指南

## 1. 创建 GitHub 仓库

1. 登录 GitHub，点击右上角 **+** → **New repository**
2. 仓库名称填写：`english-reader-enhancement`
3. 选择 **Public**
4. 点击 **Create repository**

## 2. 初始化本地仓库并推送

```bash
# 进入项目目录
cd english-reader-enhancement

# 初始化 git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: English Reader Enhancement"

# 关联远程仓库（将下面的 URL 替换为你自己的）
git remote add origin https://github.com/YOUR_USERNAME/english-reader-enhancement.git

# 推送
git branch -M main
git push -u origin main
```

## 3. 启用 GitHub Pages

1. 进入仓库页面 → **Settings** → **Pages**
2. **Source** 选择 **Deploy from a branch**
3. **Branch** 选择 `gh-pages` / `main`（如果使用 GitHub Actions）

### 方案 A：使用 GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 方案 B：手动部署（推荐快速测试）

```bash
# 安装 gh-pages
npm install --save-dev gh-pages

# 在 package.json 中添加：
# "scripts": {
#   "deploy": "gh-pages -d dist"
# }

# 构建并部署
npm run build
npm run deploy
```

## 4. 访问

部署成功后，访问：
```
https://YOUR_USERNAME.github.io/english-reader-enhancement/
```

---

## 文件说明

| 文件/目录 | 说明 |
|-----------|------|
| `src/utils/analyzer.ts` | 核心分析引擎 |
| `src/components/` | React 组件 |
| `src/hooks/` | 自定义 Hooks |
| `src/data/demoChapter.ts` | 示例章节数据 |
| `vite.config.ts` | Vite 配置（含 base 路径） |

## 自定义配置

### 修改基础词库
编辑 `src/data/demoChapter.ts` 中的 `sampleUserVocab`：

```typescript
export const sampleUserVocab = new Set([
  // 添加你的已知单词
  'your', 'custom', 'vocabulary', 'here'
]);
```

### 接入真实后端
修改 `src/hooks/useVocabulary.ts` 中的存储逻辑，将 `localStorage` 替换为 API 调用：

```typescript
// 替换 localStorage 部分
const response = await fetch('/api/vocabulary');
const data = await response.json();
```

### 更换阅读材料
修改 `src/App.tsx` 中的 `demoChapter`：

```typescript
const myChapter = {
  id: 'my-chapter-1',
  title: 'Your Book Title',
  content: `Your chapter content here...`
};
```

---

🎉 完成！你的英语阅读增强应用现在可以在线访问了。
