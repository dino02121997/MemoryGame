import { _decorator, Component, Node } from 'cc';
import { CardManager } from './CardManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(CardManager)
    cardManager: CardManager;
     
    onLoad() {
        this.startGame();
    }
   
    startGame(){
        this.cardManager.generateCards(4,4);
    }

    restartGame(){
        this.cardManager.onClearCards();
        this.startGame();
        this.cardManager.currentPoint = 0;
        this.cardManager.currentTurn = 0;
    }


   
}

