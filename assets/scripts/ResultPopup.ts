import { _decorator, Component, Label, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('ResultPopup')
export class ResultPopup extends Component {

    @property(Label)
    turnLabel: Label = null;
    
    @property(Label)
    pointLabel: Label = null;

    start() {
        this.turnLabel.string = `Your Turn: ${GameManager.getInstance().currentTurn}`;
        this.pointLabel.string = `Your Point: ${GameManager.getInstance().currentPoint}`;
    }
    
    onClickRestart() {
        GameManager.getInstance().startGame();
        this.node.active = false;
    }

}

