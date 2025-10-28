# 📰 Half Time News - 中文热门新闻聚合平台

一个现代化的 React 应用，实时聚合展示多个中文平台的热门话题和新闻排行榜。支持快速切换查看不同平台的最新热门内容。

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-4.5.3-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.13-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ 特性

- 🔥 **多平台热门话题聚合** - 支持微博、知乎、今日头条、小红书、虎扑、百度贴吧等多个平台
- 📊 **实时点击率排行榜** - 展示每个平台点击率前50的热门话题
- 🎨 **现代化 UI 设计** - 简洁美观的界面设计，流畅的切换动画
- ⚡ **快速响应** - 基于 Vite 构建，极速的开发体验和热更新
- 📱 **响应式设计** - 适配桌面和移动设备
- 🔄 **流畅动画** - 优雅的加载动画和切换效果
- 🏷️ **热榜标识** - 突出显示爆款热点内容

## 🛠️ 技术栈

- **React 19** - 现代化的前端框架
- **Vite** - 下一代前端构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **React Feather Icons** - 轻量级图标库

## 📦 安装

### 前置要求

- Node.js >= 16.0.0
- npm、yarn 或 pnpm

### 克隆项目

```bash
git clone https://github.com/your-username/Hafl_Time_News.git
cd Hafl_Time_News
```

### 安装依赖

使用 npm:
```bash
npm install
```

或使用 yarn:
```bash
yarn install
```

或使用 pnpm:
```bash
pnpm install
```

## 🚀 运行

### 开发模式

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

### 预览生产构建

```bash
npm run preview
# 或
yarn preview
# 或
pnpm preview
```

## 📁 项目结构

```
Hafl_Time_News/
├── public/              # 静态资源目录
├── src/
│   ├── App.jsx         # 主应用组件
│   ├── index.jsx       # 应用入口文件
│   ├── styles.css      # 全局样式文件
│   └── vite-env.d.ts   # Vite 类型声明
├── index.html          # HTML 模板
├── package.json        # 项目配置和依赖
├── vite.config.ts      # Vite 配置文件
├── tailwind.config.js  # Tailwind CSS 配置
└── postcss.config.js   # PostCSS 配置
```

## 🎯 使用说明

1. **选择平台** - 点击左侧导航栏中的平台名称（微博、知乎、今日头条等）
2. **查看热门** - 右侧会显示该平台点击率前50的热门话题
3. **查看详情** - 点击任意新闻标题可查看详情（需要接入具体 API）
4. **快速切换** - 在不同平台间快速切换，查看各平台最新热门内容

## 🎨 功能展示

### 支持的平台

- 🔵 微博 - 实时微博热搜榜
- 🔶 知乎 - 知乎热门话题
- 📰 今日头条 - 头条热点
- 📸 小红书 - 小红书热门
- 🏀 虎扑 - 虎扑热门讨论
- 💬 百度贴吧 - 贴吧热门话题

### 界面特点

- 清晰的导航结构
- 直观的排名展示
- 实时的点击率数据
- 优雅的加载动画
- 爆款热点标识

## 🔮 未来计划

- [ ] 接入真实的 API 数据源
- [ ] 支持实时数据更新
- [ ] 添加新闻详情页面
- [ ] 支持搜索功能
- [ ] 添加暗色模式
- [ ] 支持自定义平台列表
- [ ] 添加数据缓存机制
- [ ] 支持导出功能

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👤 作者

**Your Name**

- GitHub: [@your-username](https://github.com/your-username)

## 🙏 致谢

- [React](https://react.dev/) - 优秀的前端框架
- [Vite](https://vitejs.dev/) - 极速的开发工具
- [Tailwind CSS](https://tailwindcss.com/) - 强大的 CSS 框架

---

如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！

