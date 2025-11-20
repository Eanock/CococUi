# 快速开始 - WePlayCocos 组件库

## 🎯 三步上手

### 步骤 1: 获取组件库

在你的 Cocos Creator 项目根目录：

```bash
git clone https://gitlab.yourcompany.com/your-group/weplay-cocos-components.git .cocos-library
```

这会将组件库克隆到项目的 `.cocos-library` 目录。

### 步骤 2: 查看可用组件

```bash
node .cocos-library/scripts/copy-component.js list
```

你会看到类似这样的输出：

```
📦 可用组件列表

🎨 UI 组件:
──────────────────────────────────────────────────
  button                   按钮组件
  loading-spinner          加载动画
  toast                    Toast 提示

总计: 3 个组件

使用方法: node .cocos-library/scripts/copy-component.js <component-name>
```

### 步骤 3: 添加组件

```bash
node .cocos-library/scripts/copy-component.js button
```

完成！组件已复制到 `assets/components/button/` 目录。

## 📝 在代码中使用

打开 Cocos Creator，在你的脚本中：

```typescript
import { _decorator, Component } from 'cc';
import { Button } from './components/button/Button';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    @property(Button)
    myButton: Button = null!;

    start() {
        this.myButton.setText('开始游戏');
    }

    onButtonClick() {
        console.log('按钮被点击！');
    }
}
```

## 💡 常用命令

```bash
# 创建别名（可选，让命令更短）
alias cocos-ui="node .cocos-library/scripts/copy-component.js"

# 之后可以这样使用：
cocos-ui list
cocos-ui button
cocos-ui toast --overwrite
cocos-ui button --path ui/common
```

## 🔄 更新组件库

当组件库有更新时：

```bash
cd .cocos-library
git pull
cd ..
```

然后重新添加需要更新的组件（使用 `--overwrite`）：

```bash
node .cocos-library/scripts/copy-component.js button --overwrite
```

## ⚙️ 高级选项

### 覆盖已存在的文件

```bash
node .cocos-library/scripts/copy-component.js button --overwrite
```

### 安装到自定义路径

```bash
# 安装到 assets/ui/common/ 目录
node .cocos-library/scripts/copy-component.js button --path ui/common
```

### 搜索组件

```bash
node .cocos-library/scripts/copy-component.js list --search button
```

### 按类型筛选

```bash
node .cocos-library/scripts/copy-component.js list --type ui
```

## 📦 添加多个组件

```bash
# 一次添加多个
node .cocos-library/scripts/copy-component.js button
node .cocos-library/scripts/copy-component.js toast
node .cocos-library/scripts/copy-component.js loading-spinner

# 或创建一个脚本
cat > add-components.sh << 'EOF'
#!/bin/bash
COCOS_UI="node .cocos-library/scripts/copy-component.js"

$COCOS_UI button
$COCOS_UI toast
$COCOS_UI loading-spinner

echo "✅ 所有组件已添加"
EOF

chmod +x add-components.sh
./add-components.sh
```

## 🎨 在 Cocos Creator 中预览

1. 打开 Cocos Creator
2. 在资源管理器中找到 `assets/components/` 目录
3. 双击 `.prefab` 文件预览预制体
4. 将预制体拖拽到场景中使用

## 🐛 故障排除

### 找不到 git 命令

确保已安装 Git：

```bash
# macOS
brew install git

# Windows
# 下载并安装 Git for Windows
```

### 权限问题

如果遇到权限错误：

```bash
chmod +x .cocos-library/scripts/copy-component.js
```

### 组件已存在

如果组件已存在，脚本会跳过并提示。使用 `--overwrite` 强制覆盖：

```bash
node .cocos-library/scripts/copy-component.js button --overwrite
```

## 📖 下一步

- 查看 [README.md](README.md) 了解更多功能
- 查看 [使用指南](docs/USAGE.md) 了解详细用法
- 查看 [示例代码](examples/basic-usage.md) 学习最佳实践
- 查看各组件的 README 了解 API

## 💬 需要帮助？

- 查看文档：[docs/](docs/)
- 提交 Issue：GitLab Issues
- 联系团队：team@example.com

---

祝你使用愉快！🎮

