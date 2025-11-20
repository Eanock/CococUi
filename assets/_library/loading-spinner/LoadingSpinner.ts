import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 加载动画组件
 * 提供旋转的加载动画效果
 */
@ccclass('LoadingSpinner')
export class LoadingSpinner extends Component {
    @property(Node)
    spinner: Node = null!;

    @property
    rotationSpeed: number = 360; // 度/秒

    @property
    autoStart: boolean = true;

    private _isSpinning: boolean = false;
    private _rotation: number = 0;

    start() {
        if (this.autoStart) {
            this.startSpinning();
        }
    }

    update(deltaTime: number) {
        if (this._isSpinning && this.spinner) {
            this._rotation += this.rotationSpeed * deltaTime;
            if (this._rotation >= 360) {
                this._rotation -= 360;
            }
            
            this.spinner.setRotationFromEuler(new Vec3(0, 0, -this._rotation));
        }
    }

    /**
     * 开始旋转
     */
    startSpinning() {
        this._isSpinning = true;
        if (this.spinner) {
            this.spinner.active = true;
        }
    }

    /**
     * 停止旋转
     */
    stopSpinning() {
        this._isSpinning = false;
        if (this.spinner) {
            this.spinner.active = false;
        }
    }

    /**
     * 是否正在旋转
     */
    isSpinning(): boolean {
        return this._isSpinning;
    }

    /**
     * 设置旋转速度
     */
    setSpeed(speed: number) {
        this.rotationSpeed = speed;
    }
}

