import { _decorator, Color, Component, find, Label, Node } from 'cc';
import { Score } from '../types/level';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('ResultPopup')
export class ResultPopup extends Component {

    @property(Label)
    resultLabel: Label = null;

    @property(Label)
    turnLabel: Label = null;
    
    @property(Label)
    pointLabel: Label = null;

    uiManager: UIManager = null;

    winColor = new Color(73, 184, 64);
    failColor = new Color(255, 63, 62);

    onLoad(){
        this.uiManager = find("Canvas/UIManager").getComponent(UIManager);
    }


    setInfo(userScore: Score,isWin: boolean) {
        this.resultLabel.string = isWin ? 'You Win!' : 'Game Over!'
        this.resultLabel.color = isWin ? this.winColor : this.failColor;
        this.turnLabel.string = `Your Turn: ${userScore.turn}`;
        this.pointLabel.string = `Your Point: ${userScore.point}`;
        this.resultLabel.node.active = true;
    }

    clearOldResult(){
        this.resultLabel.string = '';
        this.resultLabel.color = Color.TRANSPARENT;
        this.turnLabel.string = '';
        this.pointLabel.string = '';
    }

    onClickChooseLevel(){
        this.uiManager.showSettingPopup();
        this.node.active = false;
    }
    
    onClickRestart() {
        this.uiManager.startGame();
        this.node.active = false;
    }

}

