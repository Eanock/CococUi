# 使用指南

本文档详细说明如何使用 WePlayCocos 组件库。

## 📚 目录

- [安装配置](#安装配置)
- [基本使用](#基本使用)
- [高级用法](#高级用法)
- [常见问题](#常见问题)

## 🚀 安装配置

### 方式一：全局安装 CLI

```bash
# 克隆组件库仓库
git clone https://gitlab.yourcompany.com/your-group/weplay-cocos-components.git

# 进入 CLI 目录
cd weplay-cocos-components/cli

# 安装依赖
npm install

# 构建
npm run build

# 全局安装
npm link

# 现在可以在任何地方使用
cocos-components --help
```

### 方式二：使用 npx（推荐）

如果你的 CLI 已经发布到 npm 或私有 npm 仓库：

```bash
npx cocos-components-cli <command>
```

### 方式三：本地使用

```bash
# 在 CLI 目录下
npm run build

# 使用相对路径
node dist/index.js <command>
```

## 📖 基本使用

### 1. 初始化项目

在你的 Cocos Creator 项目根目录下运行：

```bash
cocos-components init
```

系统会提示你输入组件库的 Git 仓库地址：

```
请输入组件库 Git 仓库地址: https://gitlab.yourcompany.com/your-group/weplay-cocos-components.git
```

初始化完成后，会在项目根目录生成 `.cocos-components.json` 配置文件。

### 2. 浏览可用组件

查看所有可用的组件：

```bash
cocos-components list
```

输出示例：

```
📦 可用组件列表

WePlayCocos 组件库 v1.0.0
公司内部 Cocos Creator 组件库
分支: master | 提交: a1b2c3d

🎨 UI 组件:
──────────────────────────────────────────────────
  button                   按钮组件
  loading-spinner          加载动画
  toast                    Toast 提示

总计: 3 个组件

使用方法: cocos-components add <component-name>
```

### 3. 添加组件

添加单个组件：

```bash
cocos-components add button
```

添加多个组件：

```bash
cocos-components add button toast loading-spinner
```

交互式选择组件（不指定组件名时）：

```bash
cocos-components add
```

### 4. 在 Cocos Creator 中使用

组件添加完成后：

1. 打开 Cocos Creator 编辑器
2. 在资源管理器中找到 `assets/components/` 目录
3. 查看刚添加的组件
4. 将预制体拖拽到场景中，或在脚本中引用组件类

## 🔧 高级用法

### 覆盖已存在的文件

默认情况下，如果文件已存在，CLI 会跳过该文件。使用 `--overwrite` 强制覆盖：

```bash
cocos-components add button --overwrite
```

### 指定安装路径

默认组件会安装到 `assets/components/` 目录。你可以指定自定义路径：

```bash
# 安装到 assets/ui/common/ 目录
cocos-components add button --path ui/common

# 安装到 assets/custom/ 目录
cocos-components add toast --path custom
```

### 按类型筛选组件

```bash
# 只显示 UI 组件
cocos-components list --type ui

# 只显示逻辑组件
cocos-components list --type logic

# 只显示特效组件
cocos-components list --type effect

# 只显示工具组件
cocos-components list --type utility
```

### 搜索组件

```bash
# 搜索包含 "button" 的组件
cocos-components list --search button

# 搜索包含 "load" 的组件
cocos-components list --search load
```

### 更新组件库

定期更新本地缓存的组件库，获取最新的组件：

```bash
cocos-components update
```

这会从 Git 仓库拉取最新代码。

## 💡 实际案例

### 案例 1：创建登录界面

```bash
# 添加所需组件
cocos-components add button input-field toast

# 在 Cocos Creator 中使用
```

在脚本中：

```typescript
import { Button } from '../components/button/Button';
import { ToastManager } from '../components/toast/ToastManager';

export class LoginScene extends Component {
    @property(Button)
    loginButton: Button = null!;

    start() {
        // 设置按钮文本
        this.loginButton.setText('登录');
        
        // 监听按钮点击（通过 EventHandler 在编辑器中配置）
    }

    onLoginClick() {
        // 显示 Toast
        ToastManager.show('登录成功！', 2);
    }
}
```

### 案例 2：添加加载界面

```bash
# 添加加载动画
cocos-components add loading-spinner
```

使用：

```typescript
import { LoadingSpinner } from '../components/loading-spinner/LoadingSpinner';

export class GameScene extends Component {
    @property(LoadingSpinner)
    loading: LoadingSpinner = null!;

    async loadGameData() {
        // 开始加载动画
        this.loading.startSpinning();
        
        try {
            // 加载数据...
            await this.fetchData();
        } finally {
            // 停止加载动画
            this.loading.stopSpinning();
        }
    }
}
```

### 案例 3：团队协作

**场景**：多个开发者在不同项目中使用相同的组件库。

1. **项目 A 开发者**：

```bash
cd ProjectA
cocos-components init
cocos-components add button toast
```

2. **项目 B 开发者**：

```bash
cd ProjectB
cocos-components init
cocos-components add button loading-spinner
```

3. **组件库维护者添加新组件后**：

```bash
# 所有项目更新组件库
cocos-components update
cocos-components list  # 查看新组件
cocos-components add new-component  # 添加新组件
```

## 🎨 自定义组件

添加组件后，代码在你的项目中，你可以随意修改：

```typescript
// 修改按钮组件
import { Button } from '../components/button/Button';

// 扩展按钮组件
export class MyCustomButton extends Button {
    // 添加自定义功能
    playClickSound() {
        // 播放音效
    }
}
```

## 🔄 组件依赖管理

有些组件可能依赖其他组件。CLI 会自动处理依赖关系：

```bash
# 假设 ComponentB 依赖 ComponentA
cocos-components add component-b

# 系统会提示：
# 依赖项: component-a
# 是否同时安装依赖组件？ (Y/n)

# 选择 Y 后，会自动安装 ComponentA 和 ComponentB
```

## 📁 文件结构

添加组件后的项目结构：

```
YourCocosProject/
├── assets/
│   └── components/          # 组件目录
│       ├── button/
│       │   ├── Button.ts
│       │   ├── Button.ts.meta
│       │   ├── Button.prefab
│       │   └── Button.prefab.meta
│       ├── toast/
│       │   ├── Toast.ts
│       │   ├── ToastManager.ts
│       │   └── Toast.prefab
│       └── ...
├── .cocos-components.json   # 组件库配置
└── ...
```

## ⚙️ 配置说明

### .cocos-components.json

```json
{
  "repository": "https://gitlab.yourcompany.com/your-group/weplay-cocos-components.git",
  "componentsPath": "assets/components",
  "lastUpdate": "2024-01-01T00:00:00.000Z"
}
```

- **repository**: 组件库仓库地址
- **componentsPath**: 组件安装路径（相对于项目根目录）
- **lastUpdate**: 最后更新时间

## 🐛 常见问题

### Q: 如何处理组件冲突？

A: 如果项目中已有同名组件：

```bash
# 方式 1: 跳过已存在的文件（默认）
cocos-components add button

# 方式 2: 强制覆盖
cocos-components add button --overwrite

# 方式 3: 安装到不同路径
cocos-components add button --path ui/custom
```

### Q: 如何更新单个组件？

A: 使用 `--overwrite` 参数重新添加：

```bash
cocos-components update  # 先更新组件库
cocos-components add button --overwrite  # 覆盖旧版本
```

### Q: 添加的组件在 Cocos Creator 中看不到？

A: 检查以下几点：

1. 刷新 Cocos Creator 资源管理器
2. 检查文件是否正确复制到 `assets/` 目录
3. 检查 `.meta` 文件是否存在
4. 重启 Cocos Creator

### Q: 如何删除组件？

A: 直接在 Cocos Creator 中删除对应文件，或使用系统命令：

```bash
# macOS/Linux
rm -rf assets/components/button

# Windows
rmdir /s assets\components\button
```

### Q: 组件库更新后，已使用的组件会自动更新吗？

A: 不会。需要手动重新添加：

```bash
cocos-components update
cocos-components add button --overwrite
```

### Q: 如何在多个项目间共享同一组件库配置？

A: 所有项目都使用同一个仓库地址初始化即可：

```bash
# 所有项目都执行
cocos-components init --repository https://your-repo.git
```

### Q: CLI 工具在哪里缓存组件库？

A: 默认缓存在用户目录下：

- macOS/Linux: `~/.cocos-components-cache/`
- Windows: `C:\Users\<YourName>\.cocos-components-cache\`

可以手动删除缓存后重新 `update`。

### Q: 如何在 CI/CD 中使用？

A: 在 CI 脚本中：

```bash
# 安装 CLI
npm install -g cocos-components-cli

# 初始化并添加组件
cocos-components init --repository https://your-repo.git
cocos-components add button toast --overwrite
```

## 📚 更多资源

- [README.md](../README.md) - 项目概述
- [CONTRIBUTING.md](../CONTRIBUTING.md) - 贡献指南
- [组件文档](../components/) - 各组件的详细文档
- [CLI 源码](../cli/src/) - CLI 工具源码

## 💬 获取帮助

- 查看命令帮助：`cocos-components --help`
- 查看子命令帮助：`cocos-components add --help`
- 提交 Issue：GitLab Issues
- 联系团队：team@example.com

---

祝你使用愉快！🎮

