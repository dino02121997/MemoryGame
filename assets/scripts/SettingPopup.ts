import { _decorator, Component, Node , ToggleContainer} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameSetting')
export class GameSetting extends Component {
   @property(ToggleContainer) 
   toggleGroup: ToggleContainer = null;

   onClickGroup(Event){
     console.log(Event)
    //  this.toggleGroup.notifyToggleCheck(this.toggleGroup.toggleItems[0],true);
   }
   
}

