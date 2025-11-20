# Button 按钮组件

通用的 UI 按钮组件，支持多种样式和交互效果。

## 特性

- ✅ 完整的按钮交互状态（normal、hover、pressed、disabled）
- ✅ 自定义颜色主题
- ✅ 灵活的文本设置
- ✅ 事件回调支持
- ✅ TypeScript 类型支持

## 使用方法

### 1. 添加组件到项目

```bash
cocos-components add button
```

### 2. 在场景中使用

将 `Button.prefab` 拖拽到场景中，或者手动创建节点并添加 `Button` 脚本。

### 3. 配置属性

在 Cocos Creator 编辑器中配置：

- **label**: Label 组件引用
- **background**: Sprite 组件引用（用于背景色变化）
- **text**: 按钮文本
- **normalColor**: 普通状态颜色
- **hoverColor**: 悬停状态颜色
- **pressedColor**: 按下状态颜色
- **disabledColor**: 禁用状态颜色
- **clickEvents**: 点击事件列表

### 4. 代码示例

```typescript
import { Button } from './components/button/Button';

// 获取按钮组件
const button = this.node.getComponent(Button);

// 设置文本
button.setText('点击我');

// 设置启用状态
button.setEnabled(true);

// 检查启用状态
if (button.isEnabled()) {
    console.log('按钮可用');
}
```

## API

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| label | Label | Label 组件引用 |
| background | Sprite | Sprite 组件引用 |
| text | string | 按钮文本 |
| normalColor | Color | 普通状态颜色 |
| hoverColor | Color | 悬停状态颜色 |
| pressedColor | Color | 按下状态颜色 |
| disabledColor | Color | 禁用状态颜色 |
| clickEvents | EventHandler[] | 点击事件列表 |

### 方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| setText | text: string | void | 设置按钮文本 |
| setEnabled | enabled: boolean | void | 设置按钮启用状态 |
| isEnabled | - | boolean | 获取按钮启用状态 |

## 依赖

无

## 版本

1.0.0

