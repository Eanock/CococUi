# 基本使用示例

本文档展示如何在实际项目中使用 WePlayCocos 组件库的各个组件。

## 示例 1: 使用 Button 组件

### 场景设置

1. 添加组件到项目：

```bash
cocos-components add button
```

2. 在 Cocos Creator 中：
   - 将 `Button.prefab` 拖拽到场景中
   - 或创建空节点并添加 `Button` 组件

### 代码示例

```typescript
import { _decorator, Component, Node } from 'cc';
import { Button } from './components/button/Button';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    @property(Button)
    startButton: Button = null!;

    @property(Button)
    settingsButton: Button = null!;

    start() {
        // 设置按钮文本
        this.startButton.setText('开始游戏');
        this.settingsButton.setText('设置');
        
        // 配置按钮事件（在编辑器的 clickEvents 中设置）
    }

    onStartClick() {
        console.log('开始游戏');
        // 禁用按钮
        this.startButton.setEnabled(false);
        
        // 2秒后重新启用
        setTimeout(() => {
            this.startButton.setEnabled(true);
        }, 2000);
    }

    onSettingsClick() {
        console.log('打开设置');
    }
}
```

## 示例 2: 使用 LoadingSpinner 组件

### 场景设置

```bash
cocos-components add loading-spinner
```

### 代码示例

```typescript
import { _decorator, Component, Node } from 'cc';
import { LoadingSpinner } from './components/loading-spinner/LoadingSpinner';
const { ccclass, property } = _decorator;

@ccclass('LoadingScene')
export class LoadingScene extends Component {
    @property(LoadingSpinner)
    spinner: LoadingSpinner = null!;

    async start() {
        // 开始加载动画
        this.spinner.startSpinning();
        
        try {
            // 模拟加载资源
            await this.loadGameResources();
            
            console.log('加载完成');
        } catch (error) {
            console.error('加载失败', error);
        } finally {
            // 停止加载动画
            this.spinner.stopSpinning();
        }
    }

    async loadGameResources(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, 3000);
        });
    }

    onSpeedChange(slider: any) {
        // 根据滑块值调整旋转速度
        const speed = slider.progress * 720; // 0-720 度/秒
        this.spinner.setSpeed(speed);
    }
}
```

## 示例 3: 使用 Toast 组件

### 场景设置

```bash
cocos-components add toast
```

### 在 Canvas 节点上添加 ToastManager

1. 创建一个持久化的 Canvas 节点
2. 添加 `ToastManager` 组件
3. 在 `toastPrefab` 属性中设置 `Toast.prefab`

### 代码示例

```typescript
import { _decorator, Component } from 'cc';
import { ToastManager } from './components/toast/ToastManager';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    start() {
        // 确保 ToastManager 已初始化
    }

    onPlayerScored() {
        // 显示得分提示
        ToastManager.show('得分 +10', 1.5);
    }

    onGameWin() {
        // 显示胜利提示
        ToastManager.show('恭喜通关！', 3);
    }

    onError() {
        // 显示错误提示
        ToastManager.show('操作失败，请重试', 2);
    }

    onNetworkError() {
        // 网络错误
        ToastManager.show('网络连接失败', 2.5);
    }

    async onSaveData() {
        try {
            await this.saveGameData();
            ToastManager.show('保存成功', 2);
        } catch (error) {
            ToastManager.show('保存失败', 2);
        }
    }

    async saveGameData(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }
}
```

## 示例 4: 组合使用多个组件

### 场景设置

```bash
cocos-components add button loading-spinner toast
```

### 完整登录界面示例

```typescript
import { _decorator, Component, EditBox } from 'cc';
import { Button } from './components/button/Button';
import { LoadingSpinner } from './components/loading-spinner/LoadingSpinner';
import { ToastManager } from './components/toast/ToastManager';
const { ccclass, property } = _decorator;

@ccclass('LoginScene')
export class LoginScene extends Component {
    @property(EditBox)
    usernameInput: EditBox = null!;

    @property(EditBox)
    passwordInput: EditBox = null!;

    @property(Button)
    loginButton: Button = null!;

    @property(LoadingSpinner)
    loadingSpinner: LoadingSpinner = null!;

    start() {
        // 初始化
        this.loginButton.setText('登录');
        this.loadingSpinner.node.active = false;
    }

    async onLoginClick() {
        const username = this.usernameInput.string;
        const password = this.passwordInput.string;

        // 验证输入
        if (!username || !password) {
            ToastManager.show('请输入用户名和密码', 2);
            return;
        }

        // 禁用登录按钮
        this.loginButton.setEnabled(false);
        
        // 显示加载动画
        this.loadingSpinner.node.active = true;
        this.loadingSpinner.startSpinning();

        try {
            // 执行登录
            await this.performLogin(username, password);
            
            ToastManager.show('登录成功！', 2);
            
            // 跳转到游戏场景
            this.gotoGameScene();
            
        } catch (error) {
            ToastManager.show('登录失败，请检查用户名和密码', 2);
            console.error('Login error:', error);
            
        } finally {
            // 恢复UI状态
            this.loginButton.setEnabled(true);
            this.loadingSpinner.stopSpinning();
            this.loadingSpinner.node.active = false;
        }
    }

    async performLogin(username: string, password: string): Promise<void> {
        // 模拟网络请求
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (username === 'admin' && password === '123456') {
                    resolve();
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 2000);
        });
    }

    gotoGameScene() {
        // 跳转逻辑
        console.log('跳转到游戏场景');
    }
}
```

## 示例 5: 创建自定义扩展

### 扩展 Button 组件

```typescript
import { _decorator, AudioClip, AudioSource } from 'cc';
import { Button } from './components/button/Button';
const { ccclass, property } = _decorator;

/**
 * 带音效的按钮
 */
@ccclass('SoundButton')
export class SoundButton extends Button {
    @property(AudioClip)
    clickSound: AudioClip = null!;

    @property(AudioClip)
    hoverSound: AudioClip = null!;

    private _audioSource: AudioSource | null = null;

    start() {
        super.start();
        
        this._audioSource = this.node.getComponent(AudioSource);
        if (!this._audioSource) {
            this._audioSource = this.node.addComponent(AudioSource);
        }

        // 监听按钮事件
        this.node.on('mouse-enter', this.onHover, this);
        this.node.on('click', this.onClick, this);
    }

    onHover() {
        if (this.hoverSound && this._audioSource) {
            this._audioSource.playOneShot(this.hoverSound, 0.5);
        }
    }

    onClick() {
        if (this.clickSound && this._audioSource) {
            this._audioSource.playOneShot(this.clickSound, 1);
        }
    }

    onDestroy() {
        this.node.off('mouse-enter', this.onHover, this);
        this.node.off('click', this.onClick, this);
    }
}
```

### 创建自定义 Toast 样式

```typescript
import { _decorator, Color } from 'cc';
import { Toast } from './components/toast/Toast';
const { ccclass, property } = _decorator;

/**
 * 彩色 Toast
 */
@ccclass('ColoredToast')
export class ColoredToast extends Toast {
    showSuccess(message: string) {
        if (this.label) {
            this.label.color = new Color(0, 255, 0, 255);
        }
        this.show(message);
    }

    showError(message: string) {
        if (this.label) {
            this.label.color = new Color(255, 0, 0, 255);
        }
        this.show(message);
    }

    showWarning(message: string) {
        if (this.label) {
            this.label.color = new Color(255, 165, 0, 255);
        }
        this.show(message);
    }

    showInfo(message: string) {
        if (this.label) {
            this.label.color = new Color(0, 150, 255, 255);
        }
        this.show(message);
    }
}
```

## 最佳实践

### 1. 组件引用

推荐使用装饰器引用组件：

```typescript
@property(Button)
myButton: Button = null!;
```

而不是：

```typescript
@property(Node)
myButtonNode: Node = null!;

// 在 start 中获取
this.myButton = this.myButtonNode.getComponent(Button);
```

### 2. 事件处理

优先使用 Cocos Creator 的 EventHandler 系统在编辑器中配置事件，保持代码简洁。

### 3. 资源管理

组件使用完毕后，注意清理资源：

```typescript
onDestroy() {
    // 清理事件监听
    this.node.off('click', this.onClick, this);
    
    // 停止动画
    if (this.spinner) {
        this.spinner.stopSpinning();
    }
}
```

### 4. 错误处理

始终包含错误处理逻辑：

```typescript
try {
    await this.loadData();
    ToastManager.show('加载成功', 2);
} catch (error) {
    console.error('Load error:', error);
    ToastManager.show('加载失败', 2);
} finally {
    this.loading.stopSpinning();
}
```

## 更多示例

查看各组件目录下的 `README.md` 文件，了解更多使用方法和 API 说明。

---

需要帮助？请查看 [使用指南](../docs/USAGE.md) 或提交 Issue。

