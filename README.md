# 📚 English Reader Enhancement

基于 **Hu & Nation (2000) 98%词汇覆盖率理论** 的英语阅读增强组件，为现有阅读 App 提供生词标记、覆盖率分析和阅读报告功能。

## 🎯 核心功能

### 1. 智能章节分析
- 自动统计章节总词数、去重词数
- 基于用户词库计算 **词汇覆盖率**
- 按 Hu & Nation 阈值划分舒适度等级：
  - 🟢 **≥98%** - 舒适区（流畅阅读）
  - 🟡 **95%-98%** - 挑战区（偶尔查词）
  - 🔴 **90%-95%** - 困难区（频繁卡顿）
  - ⚫ **<90%** - 不适合（建议换书）

### 2. 长按标记生词
- 阅读界面长按任意单词弹出菜单
- 一键标记为「生词」或「已掌握」
- 生词自动高亮显示（虚线下划线）
- 实时更新覆盖率数据

### 3. 阅读完成报告
- 对比阅读前后的覆盖率变化
- 统计新增生词数和标记为已掌握的词数
- 生成下章阅读建议
- 列出仍需学习的剩余生词

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/yourusername/english-reader-enhancement.git
cd english-reader-enhancement

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📖 使用说明

### 作为独立应用运行
本项目包含完整的 Demo，可直接运行体验：

1. 点击「分析章节」查看覆盖率仪表盘
2. 点击「开始阅读」进入阅读界面
3. **长按任意单词**（600ms）弹出标记菜单
4. 标记生词/已掌握单词
5. 点击「完成阅读」查看阅读报告

### 集成到现有 App

```tsx
import { VocabularyAnalyzer } from './utils/analyzer';
import { useVocabulary } from './hooks/useVocabulary';
import CoverageDashboard from './components/CoverageDashboard';
import ReadingView from './components/ReadingView';

// 1. 初始化分析器
const { getKnownWords } = useVocabulary();
const analyzer = new VocabularyAnalyzer(getKnownWords());

// 2. 分析章节
const analysis = analyzer.analyzeChapter(chapterText, chapterId);

// 3. 显示仪表盘
<CoverageDashboard analysis={analysis} onStartReading={start} />

// 4. 渲染阅读界面（支持长按标记）
<ReadingView 
  text={chapterText} 
  analysis={analysis} 
  onMarkWord={handleMark} 
  onEndReading={finish} 
/>

// 5. 生成阅读报告
const report = analyzer.generateReport(analysis, readingRecord);
```

## 🧠 理论基础

本项目基于 **Marcella Hu Hsueh-chao** 和 **Paul Nation** 的研究：

> **98% 的词汇覆盖率** 是舒适阅读的黄金标准。
> 
> - 90% 覆盖率：每10词1个生词，阅读频繁卡顿
> - 95% 覆盖率：每20词1个生词，勉强能读
> - **98% 覆盖率**：每50词1个生词，流畅无辅助阅读

详见：[生词恐惧症？Hu & Nation的研究告诉你：98%才是阅读的黄金分割线](https://mp.weixin.qq.com/s/XfxYYQJIwAUYjRjOt9uodQ)

## 🏗️ 技术架构

```
src/
├── components/
│   ├── CoverageDashboard.tsx   # 覆盖率仪表盘
│   ├── WordSpan.tsx            # 可长按标记的单词组件
│   ├── ReadingView.tsx         # 阅读界面
│   └── ReadingReport.tsx       # 阅读报告
├── hooks/
│   ├── useVocabulary.ts        # 词库管理（localStorage持久化）
│   └── useReadingSession.ts    # 阅读会话记录
├── utils/
│   └── analyzer.ts             # 核心分析引擎（分词/覆盖率计算）
├── types/
│   └── index.ts                # TypeScript类型定义
└── data/
    └── demoChapter.ts          # 示例数据
```

## 📝 API 参考

### VocabularyAnalyzer

```typescript
class VocabularyAnalyzer {
  constructor(userVocabulary: Set<string>)

  // 分析章节
  analyzeChapter(text: string, chapterId: string): ChapterAnalysis

  // 生成阅读报告
  generateReport(
    initialAnalysis: ChapterAnalysis,
    record: { wordsMarked: string[]; wordsLookedUp: string[]; duration: number }
  ): ReadingReport
}
```

### ChapterAnalysis 对象

| 字段 | 类型 | 说明 |
|------|------|------|
| `totalWords` | number | 总词数 |
| `uniqueWords` | number | 去重词数 |
| `coverageRate` | number | 覆盖率 (0-1) |
| `comfortLevel` | string | 舒适度等级 |
| `highFreqUnknown` | string[] | 高频生词列表 |
| `unknownWords` | string[] | 所有生词列表 |

## 🤝 贡献指南

欢迎提交 Issue 和 PR！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 License

[MIT](LICENSE) © Lin Xiaoming

---

**如果你也觉得背单词焦虑，不如关注「覆盖率」而非「词汇量」。享受阅读本身，词汇自然增长。** 📖✨
