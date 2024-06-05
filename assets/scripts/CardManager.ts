import { _decorator, assetManager, Component, instantiate, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { Card } from './Card';
const { ccclass, property } = _decorator;

interface PickedCard {
    index: number;
    card: Card;
}
@ccclass('CardManager')
export class CardManager extends Component {

    @property(Prefab)
    Card: Prefab = null;
    
    @property(Array<SpriteFrame>)
    animalSprites: SpriteFrame[] = [];

    cards: Card[];
    row: number = 2;
    col: number = 2;

    firstCard: PickedCard = {
        index: null,
        card : new Card(),
    };
    
    secondCard = {
        index: null,
        card : new Card(),
    };

    onLoad(){
        this.loadSprites();
    }

    loadSprites()  {
        var self = this;
        assetManager.loadBundle('texture', (err, bundle) => {
            console.log(bundle)
            for(let i = 0; i < 5;i++){
                bundle.load(`${i+1}/spriteFrame`, SpriteFrame, function (err, spriteFrame) {
                    console.log('a',spriteFrame)
                    self.animalSprites.push(spriteFrame);
                    if(i === 4){
                        self.instanceCards();
                        console.log(self.animalSprites);
                    }
                });
            }
            console.log(err)
        });
    }

    instanceCard(i){
        const card = instantiate(this.Card);
        card.getComponent(Card).initCard(i, this.animalSprites[i]);
        this.node.addChild(card);
    }

    instanceCards() {
        const length = this.row * this.col;
        let indexSprite = 0;

        for(let i = 0; i < length; i++){
            if(length / 2 === 0)  {
                indexSprite = 0
            }
            this.instanceCard(indexSprite);
            indexSprite++;
        }

    }

    compareCard(card: Card, other: Card): boolean {
        return card.value === other.value
    }

  
}

