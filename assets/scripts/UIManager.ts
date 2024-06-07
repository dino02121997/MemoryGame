import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {

    @property(Node)
    settingPopup: Node = null;

    @property(Node)
    resultPopup: Node = null;
   
    displayUI(node: Node): void {
        node.active = true;
    }
    hideUI(node: Node): void {
        node.active = false;
    }
    
    showSettingPopup(): void {
        this.displayUI(this.settingPopup);
    }
    hideSettingPopup(): void {
        this.hideUI(this.settingPopup);
    }
    showResultPopup(): void {
        this.displayUI(this.resultPopup);
    }
    hideResultPopup(): void {
        this.hideUI(this.resultPopup);
    }
}

