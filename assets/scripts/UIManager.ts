import { _decorator, Component, Node } from 'cc';
import { ResultPopup } from './ResultPopup';
import { SettingPopup } from './SettingPopup';
import { MainScreen } from './MainScreen';
import { GameManager } from './GameManager';
import { Score } from '../types/level';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {

    @property(SettingPopup)
    settingPopup: SettingPopup = null;

    @property(ResultPopup)
    resultPopup: ResultPopup = null;

    @property(MainScreen)
    mainScreen: MainScreen = null;
   
    displayUI(node: Node): void {
        node.active = true;
    }
    hideUI(node: Node): void {
        node.active = false;
    }
    
    showSettingPopup(): void {
        this.displayUI(this.settingPopup.node);
    }

    hideSettingPopup(): void {
        this.hideUI(this.settingPopup.node);
    }

    showResultPopup(userScore: Score,isWin: boolean): void {
        this.resultPopup.setInfo(userScore,isWin);
        this.displayUI(this.resultPopup.node);
    }

    hideResultPopup(): void {
        this.hideUI(this.resultPopup.node);
    }

    startGame(){
        GameManager.getInstance().startGame();
    }

    updatePoint(userScore:Score, levelScore:Score) {
        this.mainScreen.updatePoint(userScore.point,levelScore.point);
    }
    
    updateTurn(userScore:Score, levelScore:Score) {
        this.mainScreen.updateTurn(userScore.turn,levelScore.turn);
    }
}

