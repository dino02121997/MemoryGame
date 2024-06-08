import { _decorator, Component, find, Label, Node } from 'cc';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('MainScreen')
export class MainScreen extends Component {
    
    @property(Label)
    pointLabel: Label = null;

    @property(Label)
    turnLabel: Label = null;
    
    uiManager: UIManager = null;

    onLoad(){
        this.uiManager = find("Canvas/UIManager").getComponent(UIManager);
    }

    updatePoint(point: number,levelPoint: number){
        this.pointLabel.string = `Your point: ${point}/${levelPoint}`;
    }

    updateTurn(turn: number,levelTurn: number){
        this.turnLabel.string = `Your Turn: ${turn}/${levelTurn}`;
    }

    onClickSetting(){
        this.uiManager.showSettingPopup();
        this.node.active = false;
    }
}

