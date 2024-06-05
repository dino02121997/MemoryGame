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
    row: number = 4;
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
            for(let i = 0; i < 5;i++){
                bundle.load(`${i+1}/spriteFrame`, SpriteFrame, function (err, spriteFrame) {
                    self.animalSprites.push(spriteFrame);
                    if(i === 4){
                        self.instanceCards();
                        self.randomizeChildren();
                        console.log(self.animalSprites);
                    }
                });
            }
            console.log(err)
        });
    }

    instanceCards() {
        const length = this.row * this.col;
        let indexSprite = 0;
        const sprites = this.getRandomPair(this.row);
        console.log('result',sprites)
        for(let i = 0; i < length; i++){
            if(length / 2 === i)  {
                indexSprite = 0;
            }
            this.instanceCard(indexSprite,sprites);
            indexSprite++;
        }
    }

    getRandomPair(nCouple): SpriteFrame[] {
        const shuffled = [...this.animalSprites].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, nCouple);
    }

    instanceCard(i, sprites){
        const card = instantiate(this.Card);
        card.getComponent(Card).initCard(i, sprites[i]);
        card.active = false;
        this.node.addChild(card);
    }

    randomizeChildren() {
        let children = this.node.children.slice();

        let shuffled = [...children].sort(() => 0.5 - Math.random());

        for (let child of children) {
            child.removeFromParent();
        }

        for (let child of shuffled) {
            this.node.addChild(child);
            child.active = true;
        }
    }

    compareCard(card: Card, other: Card): boolean {
        return card.value === other.value
    }

  
}

