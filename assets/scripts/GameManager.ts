import { _decorator, Component, director, find, Node } from 'cc';
import { CardManager } from './CardManager';
import { Level } from '../types/level';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    cardManager: CardManager;
    uiManager: UIManager;

    gameLevel:Level = {
        col: 2,
        row: 2
    }

    levelPoint: number = 2;

    currentPoint: number = 0;
    currentTurn: number = 0;


    static instance: GameManager;

    static getInstance(): GameManager {
        if (!GameManager.instance) {
          let node = new Node("GameManager");
          GameManager.instance = node.addComponent(GameManager);
          
          director.addPersistRootNode(GameManager.instance.node);
        }
        return GameManager.instance;
    }
    onLoad(){
        this.cardManager = find('Canvas/MainScreen/Cards').getComponent(CardManager);
        this.uiManager = find('Canvas/UIManager').getComponent(UIManager);
    }

    setGameLevel(level:{col:number, row:number}){
       this.gameLevel = {...level}
       this.levelPoint = Math.floor(this.gameLevel.col * this.gameLevel.row / 2);
    }
  
    startGame(){
        this.cardManager.onClearCards();
        this.cardManager.generateCards(this.gameLevel.col,this.gameLevel.row);
        this.currentPoint = 0;
        this.currentTurn = 0;
    }

    updatePoint(){
        this.currentPoint++;
        if(this.currentPoint !== this.levelPoint) return;
        this.uiManager.showResultPopup();
    }

    updateTurn(){
        this.currentTurn++; 
    }

   
}

