# CocosUi 组件库

> 基于 shadcn/ui 理念的 Cocos Creator 组件库系统

## 🎯 项目简介

CocosUi 是一个 Cocos Creator 组件库项目，采用类似 shadcn/ui 的设计理念：

- ✅ **源码直接复制**：组件代码直接复制到项目中，完全可控
- ✅ **完全可定制**：代码在你的项目中，随意修改
- ✅ **简单易用**：一个脚本搞定，无需复杂安装
- ✅ **编辑器可见**：组件在 assets 目录下，可在 Cocos Creator 中预览
- ✅ **TypeScript**：完整的类型支持
- ✅ **模块化设计**：按需使用，不引入冗余代码

## 🚀 快速开始

### 方式一：直接使用脚本（推荐，最简单）

```bash
# 1. 在你的 Cocos Creator 项目中，克隆组件库（仅首次）
git clone https://gitlab.yourcompany.com/your-group/weplay-cocos-components.git .cocos-library

# 2. 列出所有可用组件
node .cocos-library/scripts/copy-component.js list

# 3. 添加组件
node .cocos-library/scripts/copy-component.js button

# 4. 添加多个组件
node .cocos-library/scripts/copy-component.js button
node .cocos-library/scripts/copy-component.js toast
```

### 方式二：使用 npx（如果发布到 npm）

如果你的组件库已发布到公司内部 npm 或 npmjs.org：

```bash
# 列出组件
npx cocos-ui list

# 添加组件
npx cocos-ui button

# 覆盖已存在的文件
npx cocos-ui button --overwrite

# 指定安装路径
npx cocos-ui button --path ui/common
```

### 方式三：使用功能完整的 CLI（可选）

如果需要更多功能（如缓存管理、依赖处理等）：

```bash
# 进入 CLI 目录
cd .cocos-library/cli

# 安装并构建
npm install && npm run build

# 全局安装
npm link

# 使用
cocos-components init
cocos-components list
cocos-components add button
```

## 📦 项目结构

```
CocosUi/
├── assets/
│   └── _library/           # 组件库源码（可在编辑器中预览）
│       ├── button/
│       │   ├── Button.ts
│       │   ├── Button.prefab
│       │   ├── component.json
│       │   └── README.md
│       ├── toast/
│       ├── loading-spinner/
│       └── registry.json
│
├── scripts/
│   └── copy-component.js   # 简单复制脚本（无需构建）
│
├── cli/                    # 完整 CLI 工具（可选）
│   ├── src/
│   └── package.json
│
└── package.json           # 支持 npx 使用
```

## 💡 使用示例

### 基本用法

```bash
# 在你的 Cocos Creator 项目根目录

# 查看所有组件
node .cocos-library/scripts/copy-component.js list

# 输出:
# 📦 可用组件列表
# 
# 🎨 UI 组件:
# ──────────────────────────────────────────────────
#   button                   按钮组件
#   loading-spinner          加载动画
#   toast                    Toast 提示
```

### 添加组件

```bash
# 添加按钮组件
node .cocos-library/scripts/copy-component.js button

# 输出:
# ✓ 组件库已更新
# ℹ 正在添加组件: 按钮组件
# ✓ 已复制 3 个文件:
#   assets/components/button/Button.ts
#   assets/components/button/Button.prefab
#   assets/components/button/README.md
# ✓ 完成！请在 Cocos Creator 中查看添加的组件
```

### 高级用法

```bash
# 覆盖已存在的文件
node .cocos-library/scripts/copy-component.js button --overwrite

# 安装到自定义路径
node .cocos-library/scripts/copy-component.js button --path ui/common

# 按类型筛选
node .cocos-library/scripts/copy-component.js list --type ui

# 搜索组件
node .cocos-library/scripts/copy-component.js list --search button
```

## 🎨 在 Cocos Creator 中使用

添加组件后，在 Cocos Creator 中：

1. **查看组件**：在资源管理器中找到 `assets/components/` 目录
2. **预览预制体**：双击 `.prefab` 文件可以直接预览
3. **查看源码**：打开 `.ts` 文件查看和修改源码
4. **使用组件**：

```typescript
import { _decorator, Component } from 'cc';
import { Button } from './components/button/Button';
import { ToastManager } from './components/toast/ToastManager';
const { ccclass, property } = _decorator;

@ccclass('MyScene')
export class MyScene extends Component {
    @property(Button)
    myButton: Button = null!;

    start() {
        this.myButton.setText('点击我');
    }

    onButtonClick() {
        ToastManager.show('按钮被点击了！', 2);
    }
}
```

## 🧩 可用组件

### UI 组件

| 组件 | 名称 | 描述 |
|------|------|------|
| button | 按钮组件 | 通用的 UI 按钮组件，支持多种样式和交互效果 |
| loading-spinner | 加载动画 | 旋转加载动画组件 |
| toast | Toast 提示 | 轻量级消息提示组件 |

更多组件持续添加中...

## 📝 创建新组件

### 1. 在 assets/_library 中创建组件目录

```bash
mkdir assets/_library/my-component
```

### 2. 创建组件文件

- `MyComponent.ts` - 组件脚本
- `MyComponent.prefab` - 预制体（可选）
- `component.json` - 元数据
- `README.md` - 文档

### 3. 编写 component.json

```json
{
  "$schema": "../../schemas/component.schema.json",
  "name": "my-component",
  "displayName": "我的组件",
  "type": "ui",
  "description": "组件描述",
  "version": "1.0.0",
  "files": [
    {
      "source": "MyComponent.ts",
      "target": "assets/_library/my-component/MyComponent.ts",
      "type": "script"
    },
    {
      "source": "MyComponent.prefab",
      "target": "assets/_library/my-component/MyComponent.prefab",
      "type": "prefab"
    }
  ],
  "dependencies": [],
  "tags": ["ui"]
}
```

### 4. 更新注册表

在 `assets/_library/registry.json` 中添加：

```json
{
  "name": "my-component",
  "path": "assets/_library/my-component",
  "displayName": "我的组件",
  "type": "ui"
}
```

### 5. 提交到 GitLab

```bash
git add .
git commit -m "feat: add my-component"
git push
```

## 🔄 工作流程

### 组件库维护者

1. 在 `assets/_library/` 中开发组件
2. 可以在当前项目的 Cocos Creator 中预览和测试
3. 更新 `registry.json`
4. 提交到 GitLab

### 组件使用者

1. 克隆或更新组件库仓库
2. 使用脚本复制组件到项目
3. 在 Cocos Creator 中查看和使用
4. 根据需要修改组件代码

## 📖 命令参考

### copy-component.js 脚本

```bash
# 基本用法
node scripts/copy-component.js <component-name> [options]
node scripts/copy-component.js list [options]

# 选项
--overwrite, -o    覆盖已存在的文件
--path <path>      指定安装路径（相对于 assets 目录）
--type <type>      按类型筛选（ui/logic/effect/utility）
--search <keyword> 搜索组件
--help, -h         显示帮助信息

# 示例
node scripts/copy-component.js button
node scripts/copy-component.js button --overwrite
node scripts/copy-component.js button --path ui/common
node scripts/copy-component.js list
node scripts/copy-component.js list --type ui
node scripts/copy-component.js list --search button
```

## 🎨 设计理念

### 为什么不做成 npm 包？

参考 shadcn/ui 的设计理念：

1. **完全控制**：代码在你的项目中，可以随意修改
2. **无版本冲突**：不依赖 node_modules
3. **按需使用**：只复制你需要的组件
4. **学习友好**：可以直接查看和学习源码
5. **定制方便**：适配项目的特殊需求

### 为什么放在 assets/_library？

1. **编辑器可见**：可以在 Cocos Creator 中直接预览预制体
2. **方便开发**：维护者可以在编辑器中调试组件
3. **下划线前缀**：表示这是库文件，与项目代码区分
4. **保持整洁**：库文件和项目文件分开管理

## 🔧 发布到 npm（可选）

如果想让团队更方便使用，可以发布到公司内部 npm：

```bash
# 登录到公司 npm
npm login --registry=https://your-company-npm.com

# 发布
npm publish

# 之后团队成员可以直接使用
npx cocos-ui add button
```

## 📚 更多文档

- [使用指南](docs/USAGE.md) - 详细使用说明
- [贡献指南](CONTRIBUTING.md) - 如何贡献组件
- [使用示例](examples/basic-usage.md) - 实际案例
- [组件文档](assets/_library/) - 各组件的详细文档

## 🤝 贡献

欢迎贡献新组件或改进现有组件！请查看 [贡献指南](CONTRIBUTING.md)。

## 📄 许可证

MIT License

## 💬 支持

- 提交 Issue：GitLab Issues
- 查看文档：[docs/](docs/)
- 联系团队：team@example.com

---

Made with ❤️ by WePlay Team
