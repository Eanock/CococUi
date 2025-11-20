import { _decorator, Component, Node, Prefab, instantiate, Canvas, director } from 'cc';
import { Toast } from './Toast';
const { ccclass, property } = _decorator;

/**
 * Toast 管理器
 * 用于全局管理 Toast 提示
 */
@ccclass('ToastManager')
export class ToastManager extends Component {
    @property(Prefab)
    toastPrefab: Prefab = null!;

    private static _instance: ToastManager | null = null;
    private _toastQueue: Array<{ message: string; duration?: number }> = [];
    private _currentToast: Node | null = null;
    private _isShowing: boolean = false;

    static get instance(): ToastManager {
        return this._instance!;
    }

    onLoad() {
        if (ToastManager._instance) {
            this.node.destroy();
            return;
        }

        ToastManager._instance = this;
        director.addPersistRootNode(this.node);
    }

    onDestroy() {
        if (ToastManager._instance === this) {
            ToastManager._instance = null;
        }
    }

    /**
     * 显示 Toast 消息
     */
    static show(message: string, duration?: number) {
        if (!ToastManager._instance) {
            console.warn('ToastManager 未初始化');
            return;
        }

        ToastManager._instance.showToast(message, duration);
    }

    /**
     * 显示 Toast（实例方法）
     */
    showToast(message: string, duration?: number) {
        this._toastQueue.push({ message, duration });
        this.processQueue();
    }

    /**
     * 处理队列
     */
    private processQueue() {
        if (this._isShowing || this._toastQueue.length === 0) {
            return;
        }

        const item = this._toastQueue.shift()!;
        this._isShowing = true;

        if (!this.toastPrefab) {
            console.error('Toast Prefab 未设置');
            this._isShowing = false;
            return;
        }

        // 创建 Toast 节点
        this._currentToast = instantiate(this.toastPrefab);
        this.node.addChild(this._currentToast);

        const toast = this._currentToast.getComponent(Toast);
        if (toast) {
            if (item.duration !== undefined) {
                toast.duration = item.duration;
            }

            toast.show(item.message, () => {
                this._isShowing = false;
                this._currentToast?.destroy();
                this._currentToast = null;
                this.processQueue();
            });
        } else {
            console.error('Toast 组件未找到');
            this._isShowing = false;
        }
    }
}

