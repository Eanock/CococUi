import { _decorator, Component, Node, Label, tween, Vec3, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Toast 提示组件
 */
@ccclass('Toast')
export class Toast extends Component {
    @property(Label)
    label: Label = null!;

    @property
    duration: number = 2; // 显示时长（秒）

    @property
    fadeInDuration: number = 0.3; // 淡入时长

    @property
    fadeOutDuration: number = 0.3; // 淡出时长

    private _uiOpacity: UIOpacity | null = null;
    private _onComplete: (() => void) | null = null;

    onLoad() {
        this._uiOpacity = this.node.getComponent(UIOpacity);
        if (!this._uiOpacity) {
            this._uiOpacity = this.node.addComponent(UIOpacity);
        }
    }

    /**
     * 显示 Toast
     */
    show(message: string, onComplete?: () => void) {
        this._onComplete = onComplete || null;

        if (this.label) {
            this.label.string = message;
        }

        if (this._uiOpacity) {
            this._uiOpacity.opacity = 0;
        }

        this.node.active = true;

        // 动画序列：淡入 -> 等待 -> 淡出
        tween(this._uiOpacity)
            .to(this.fadeInDuration, { opacity: 255 })
            .delay(this.duration)
            .to(this.fadeOutDuration, { opacity: 0 })
            .call(() => {
                this.node.active = false;
                if (this._onComplete) {
                    this._onComplete();
                }
            })
            .start();
    }

    /**
     * 立即隐藏 Toast
     */
    hide() {
        tween(this.node).stop();
        this.node.active = false;
        
        if (this._onComplete) {
            this._onComplete();
            this._onComplete = null;
        }
    }
}

