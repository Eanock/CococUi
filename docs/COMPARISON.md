# 方案对比

本文档对比三种使用 WePlayCocos 组件库的方式。

## 📊 三种方式对比

| 特性 | 方式一：直接脚本 | 方式二：npx | 方式三：完整 CLI |
|------|----------------|------------|---------------|
| **安装难度** | ⭐ 最简单 | ⭐⭐ 简单 | ⭐⭐⭐ 中等 |
| **使用便捷性** | ⭐⭐ 中等 | ⭐⭐⭐ 方便 | ⭐⭐⭐ 方便 |
| **功能完整度** | ⭐⭐ 基本 | ⭐⭐ 基本 | ⭐⭐⭐ 完整 |
| **网络要求** | 首次需要 | 每次需要 | 首次需要 |
| **适用场景** | 个人使用 | 团队协作 | 企业级使用 |

## 方式一：直接使用脚本 ⭐ 推荐新手

### 优点
- ✅ 无需任何安装步骤
- ✅ 不需要 npm 环境
- ✅ 代码直观，容易理解
- ✅ 适合快速上手

### 缺点
- ❌ 命令较长
- ❌ 每次需要指定路径
- ❌ 功能相对简单

### 使用示例

```bash
# 1. 克隆到项目（首次）
git clone https://gitlab.yourcompany.com/your-group/weplay-cocos-components.git .cocos-library

# 2. 使用
node .cocos-library/scripts/copy-component.js list
node .cocos-library/scripts/copy-component.js button

# 3. 创建别名（可选）
alias cocos-ui="node .cocos-library/scripts/copy-component.js"
cocos-ui list
cocos-ui button
```

### 适合谁？
- 🎯 首次使用的新手
- 🎯 个人小项目
- 🎯 不想安装额外工具的开发者

---

## 方式二：使用 npx ⭐⭐ 推荐团队

### 优点
- ✅ 命令简短
- ✅ 自动使用最新版本
- ✅ 无需全局安装
- ✅ 适合团队标准化

### 缺点
- ❌ 需要发布到 npm
- ❌ 每次运行需要网络
- ❌ 首次运行较慢

### 前置条件

需要将包发布到 npm（公司内部或公开）：

```bash
# 发布到公司 npm
npm login --registry=https://your-company-npm.com
npm publish

# 或发布到 npmjs.org
npm login
npm publish
```

### 使用示例

```bash
# 无需安装，直接使用
npx cocos-ui list
npx cocos-ui button
npx cocos-ui toast --overwrite
npx cocos-ui button --path ui/common

# 或者先安装到项目
npm install --save-dev cocos-ui

# 然后使用
npx cocos-ui button
# 或
npm run cocos-ui button
```

### 适合谁？
- 🎯 团队协作项目
- 🎯 有内部 npm 仓库的公司
- 🎯 需要版本管理的项目

---

## 方式三：完整 CLI ⭐⭐⭐ 企业级

### 优点
- ✅ 功能最完整
- ✅ 支持依赖管理
- ✅ 本地缓存，速度快
- ✅ 丰富的配置选项

### 缺点
- ❌ 安装步骤较多
- ❌ 需要构建
- ❌ 学习成本稍高

### 使用示例

```bash
# 1. 安装（首次）
git clone https://gitlab.yourcompany.com/your-group/weplay-cocos-components.git
cd weplay-cocos-components/cli
npm install
npm run build
npm link

# 2. 初始化项目
cd /path/to/your-cocos-project
cocos-components init

# 3. 使用
cocos-components list
cocos-components add button
cocos-components update

# 4. 高级功能
cocos-components add button toast loading-spinner  # 批量添加
cocos-components list --type ui --search btn      # 高级筛选
```

### 适合谁？
- 🎯 大型团队项目
- 🎯 需要复杂依赖管理
- 🎯 企业级应用开发

---

## 💡 推荐方案

### 个人开发者 / 小项目
**方式一：直接脚本**
```bash
git clone <repo> .cocos-library
alias cocos-ui="node .cocos-library/scripts/copy-component.js"
cocos-ui button
```

### 团队协作 / 中型项目
**方式二：npx**
```bash
npx cocos-ui button
```

### 企业 / 大型项目
**方式三：完整 CLI**
```bash
cocos-components init
cocos-components add button
```

---

## 🔄 迁移指南

### 从方式一迁移到方式二

```bash
# 1. 发布到 npm
npm publish

# 2. 删除本地克隆（可选）
rm -rf .cocos-library

# 3. 使用 npx
npx cocos-ui button
```

### 从方式一/二迁移到方式三

```bash
# 1. 安装完整 CLI
git clone <repo>
cd cli && npm install && npm run build && npm link

# 2. 初始化
cocos-components init --repository <repo-url>

# 3. 使用
cocos-components add button
```

---

## 📊 性能对比

| 操作 | 方式一 | 方式二 | 方式三 |
|-----|-------|--------|--------|
| 首次设置 | ~10s | ~5s | ~60s |
| 列出组件 | ~0.5s | ~3s | ~0.3s |
| 添加组件 | ~0.5s | ~3s | ~0.3s |
| 更新组件库 | ~2s | ~3s | ~0.5s |

**注**：
- 方式一和方式三使用本地缓存，速度最快
- 方式二每次都需要下载，但无需事先安装

---

## 🎯 决策树

```
是否有 npm 仓库？
├─ 是 → 是否追求便捷？
│         ├─ 是 → 使用方式二（npx）
│         └─ 否 → 是否需要高级功能？
│                   ├─ 是 → 使用方式三（CLI）
│                   └─ 否 → 使用方式二（npx）
└─ 否 → 是否介意命令长度？
          ├─ 是 → 使用方式三（CLI）
          └─ 否 → 使用方式一（脚本）
```

---

## 💡 最佳实践

### 个人项目
```bash
# .zshrc 或 .bashrc 中添加
alias cocos-ui="node ~/.cocos-library/scripts/copy-component.js"

# 使用
cocos-ui list
cocos-ui button
```

### 团队项目
```bash
# package.json 中添加
{
  "scripts": {
    "ui:list": "npx cocos-ui list",
    "ui:add": "npx cocos-ui"
  }
}

# 使用
npm run ui:list
npm run ui:add button
```

### 企业项目
```bash
# 统一安装 CLI
npm install -g cocos-components-cli

# 在所有项目中使用统一命令
cocos-components init
cocos-components add button
```

---

选择最适合你的方式，开始使用吧！🚀

