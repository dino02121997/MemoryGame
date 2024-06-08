import { _decorator, Component, director, find, Node } from 'cc';
import { CardManager } from './CardManager';
import { Level, Score } from '../types/level';
import { UIManager } from './UIManager';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    cardManager: CardManager;
    uiManager: UIManager;

    gameLevel:Level = {
        col: 2,
        row: 2
    }

    levelScore: Score = {
        point:2,
        turn: 4
    }
    
    userScore: Score = {
        point:0,
        turn: 0
    }



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
        this.cardManager = find('Canvas/GamePlay/Cards').getComponent(CardManager);
        this.uiManager = find('Canvas/UIManager').getComponent(UIManager);
    }

    setGameLevel(level:{col:number, row:number}){
       this.gameLevel = {...level}
       this.levelScore.point = Math.floor(this.gameLevel.col * this.gameLevel.row / 2);
       this.levelScore.turn = this.levelScore.point * 2;
    }
  
    startGame(){
        this.cardManager.onClearCards();
        this.cardManager.generateCards(this.gameLevel.col,this.gameLevel.row);
        this.userScore = {
            point:0,
            turn: 0
        } 
        this.uiManager.updatePoint(this.userScore,this.levelScore);
        this.uiManager.updateTurn(this.userScore,this.levelScore);
    }

    updatePoint(){
        this.userScore.point++;
        this.uiManager.updatePoint(this.userScore,this.levelScore);
        if( this.userScore.point !== this.levelScore.point) return;
        SoundManager.getInstance().playSound('win');
        this.uiManager.showResultPopup(this.userScore,true);
    }

    updateTurn(){
        this.userScore.turn++; 
        this.uiManager.updateTurn(this.userScore,this.levelScore);
        if(this.userScore.turn < this.levelScore.turn) return;
        if( this.userScore.turn === this.levelScore.turn){
            SoundManager.getInstance().playSound('gameOver');
            this.uiManager.showResultPopup(this.userScore,false);
        }
       
    }

   
}

