import { _decorator, assetManager, Component, instantiate, Layout, Node, Prefab, Sprite, SpriteFrame } from 'cc';
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
    
    @property(SpriteFrame)
    animalSprites: SpriteFrame[] = [];

    cardValues: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    cards: Card[];
    col: number = 5;
    row: number = 6;

    firstCard: PickedCard = {
        index: null,
        card : new Card(),
    };
    
    secondCard = {
        index: null,
        card : new Card(),
    };

    onLoad(){
        // this.loadSprites();
        this.node.getComponent(Layout).constraintNum = this.col;
        this.instanceCards();
        this.randomizeChildren();
    }

    loadSprites()  {
        var self = this;
        assetManager.loadBundle('texture', (err, bundle) => {
            console.log(bundle)

            for(let i = 0; i < 15;i++){
                bundle.load(`${i+1}/spriteFrame`, SpriteFrame, function (err, spriteFrame) {
                    self.animalSprites.push(spriteFrame);
                    if(i === 14){
                        self.instanceCards();
                        self.randomizeChildren();
                    }
                });
            }
        });
    }

    instanceCards() {
        const length = this.row * this.col;
        const couple = Math.floor(length/2);
        const cardValues = this.getRandomPair(couple);
        let count = 0;
        for(let i = 0; i < length; i++){
            if(length / 2 === i )  {
                count = 0;
            }
            const spriteIndex = cardValues[count];

            this.instanceCard(count,this.animalSprites[spriteIndex]);
            count++;
        }
    }

    shuffleArray(array: number[]):  number[] { 
        for (let i = array.length - 1; i > 0; i--) { 
          const j = Math.floor(Math.random() * (i + 1)); 
          [array[i], array[j]] = [array[j], array[i]]; 
        } 
        return array; 
    };

    getRandomPair(nCouple:number): number[] {
        const shuffle = this.shuffleArray(this.cardValues);
        const result = shuffle.slice(0, nCouple)
        return shuffle.slice(0,nCouple);
    }

    instanceCard(index, spriteFrame){
        const card = instantiate(this.Card);
        // if(index === sprites.length){
        //     card.getComponent(Card).lockCard = true;
        // }
        card.getComponent(Card).initCard(index, spriteFrame);
        card.active = false;
        this.node.addChild(card);
    }

    randomizeChildren() {
        let children = this.node.children.slice();

        let shuffled = [...children].sort(() => Math.random() - 0.5);

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

