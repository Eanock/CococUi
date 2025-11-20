import { _decorator, Component, Node, Sprite, Label, UITransform, EventHandler, Button as CocosButton, Color } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 按钮组件
 * 提供丰富的按钮样式和交互效果
 */
@ccclass('Button')
export class Button extends Component {
    @property(Label)
    label: Label = null!;

    @property(Sprite)
    background: Sprite = null!;

    @property
    text: string = '按钮';

    @property({
        type: Color
    })
    normalColor: Color = new Color(255, 255, 255, 255);

    @property({
        type: Color
    })
    hoverColor: Color = new Color(240, 240, 240, 255);

    @property({
        type: Color
    })
    pressedColor: Color = new Color(200, 200, 200, 255);

    @property({
        type: Color
    })
    disabledColor: Color = new Color(150, 150, 150, 255);

    @property([EventHandler])
    clickEvents: EventHandler[] = [];

    private _button: CocosButton | null = null;

    start() {
        this.updateText();
        this.setupButton();
    }

    /**
     * 更新按钮文本
     */
    updateText() {
        if (this.label) {
            this.label.string = this.text;
        }
    }

    /**
     * 设置按钮组件
     */
    setupButton() {
        this._button = this.node.getComponent(CocosButton);
        
        if (!this._button) {
            this._button = this.node.addComponent(CocosButton);
        }

        // 设置按钮目标
        if (this.background) {
            this._button.target = this.background.node;
        }

        // 设置颜色过渡
        this._button.normalColor = this.normalColor;
        this._button.hoverColor = this.hoverColor;
        this._button.pressedColor = this.pressedColor;
        this._button.disabledColor = this.disabledColor;

        // 设置点击事件
        this._button.clickEvents = this.clickEvents;
    }

    /**
     * 设置按钮文本
     */
    setText(text: string) {
        this.text = text;
        this.updateText();
    }

    /**
     * 设置按钮启用状态
     */
    setEnabled(enabled: boolean) {
        if (this._button) {
            this._button.interactable = enabled;
        }
    }

    /**
     * 获取按钮启用状态
     */
    isEnabled(): boolean {
        return this._button ? this._button.interactable : true;
    }
}

