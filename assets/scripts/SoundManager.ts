import { _decorator, AudioClip, Component, director, Node, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {

    sounds: {[key: string]: AudioClip} = {};
    soundNames: string[] = [];
    static instance: SoundManager;

    static getInstance(): SoundManager {
        if (!SoundManager.instance) {
          let node = new Node("SoundManager");
          SoundManager.instance = node.addComponent(SoundManager);
          
          director.addPersistRootNode(SoundManager.instance.node);
        }
        return SoundManager.instance;
    }


    playSound(name: string) {
        if(this.soundNames.some(value => name === value )){
            this.sounds[name].play();
            return;
        }
        var self = this;
        resources.load(`audios/${name}`, AudioClip, function (err, audio: AudioClip) {
            if(err) return;
            audio.play();
            self.sounds[name] = audio;
            self.soundNames.push(name);
        });
    }

  
}
