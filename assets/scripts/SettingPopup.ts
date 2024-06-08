import { _decorator, Component , ToggleContainer} from 'cc';
import { GameManager } from './GameManager';
import { Level } from '../types/level';
const { ccclass, property } = _decorator;

@ccclass('SettingPopup')
export class SettingPopup extends Component {
   @property(ToggleContainer) 
   toggleGroup: ToggleContainer = null;

   selectedLevel:Level = {
      col: 2,
      row: 2
   }
   onChangeToggle(event){
      if(event.node.name === 'Level1'){
         this.selectedLevel = {
            col: 2,
            row: 2
         }
         return
      }
      if(event.node.name === 'Level2'){
         this.selectedLevel = {
            col: 3,
            row: 3
         }
         return
      }
      if(event.node.name === 'Level3'){
         this.selectedLevel = {
            col: 5,
            row: 6
         }
         return
      }
   }
   onClickStart(){
      GameManager.getInstance().setGameLevel(this.selectedLevel);
      GameManager.getInstance().startGame();
      this.node.active = false;
   }
   
}

