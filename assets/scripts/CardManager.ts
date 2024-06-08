import { _decorator, Component, instantiate, Layout, Node, Prefab, SpriteFrame, UITransform, Event } from 'cc';
import { Card } from './Card';
import { GameManager } from './GameManager';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('CardManager')
export class CardManager extends Component {

    @property(Prefab)
    Card: Prefab = null;

    @property(SpriteFrame)
    animalSprites: SpriteFrame[] = [];

    cardValues: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    cards: Card[];

    col: number;
    row: number;

    transform: UITransform;
    layout: Layout;

    currentPoint: number = 0;
    currentTurn: number = 0;

    selectedCards: Card[] = [];
    oddCards: boolean = false;
    totalCard: number;

    generateCards(col: number, row: number) {
        this.col = col;
        this.row = row;
        this.totalCard = this.row * this.col;
        this.oddCards = this.totalCard % 2 === 1;
        this.initLayout();
        this.instanceCards(this.totalCard);
    }

    initLayout() {
        this.transform = this.node.getComponent(UITransform);
        this.layout = this.node.getComponent(Layout);
        this.layout.constraintNum = this.col;
        this.transform.width = this.col * this.layout.cellSize.width + (this.col - 1) * this.layout.spacingX;
        this.transform.height = this.row * this.layout.cellSize.height + (this.row - 1) * this.layout.spacingY;
    }

    instanceCards(totalCard: number) {
        const couple = Math.floor(totalCard / 2);
        const cardValues = this.getRandomPair(couple);
        const playableCard = this.oddCards ? totalCard - 1 : totalCard;
        let count = 0;
        const renderList = [];

        for (let i = 0; i < playableCard; i++) {
            if (playableCard / 2 === i) {
                count = 0;
            }
            const spriteIndex = cardValues[count];
            renderList.push(spriteIndex);
            count++;
        }
        const renderRandomList = renderList.sort(() => Math.random() - 0.5);

        if (this.oddCards) {
            renderRandomList.splice(couple,0,-1)
        }

        for(let i = 0; i < renderRandomList.length; i++) {
            this.instanceCard(renderRandomList[i], this.animalSprites[renderRandomList[i]]);
        }

    }

    getRandomPair(nCouple: number): number[] {
        return [...this.cardValues].sort(() => Math.random() - 0.5).slice(0, nCouple);
    }

    instanceCard(value, spriteFrame) {
        const cardNode = instantiate(this.Card);
        if (value === -1) {
            cardNode.getComponent(Card).initLockCard();
        }
        else {
            cardNode.getComponent(Card).initCard(value, spriteFrame, this.onClickCard.bind(this));
        }
        this.node.addChild(cardNode);
    }



    compareCard(card: Card, other: Card): boolean {
        return card.value === other.value
    }

    onClickCard(card: Card): void {
        this.selectedCards.push(card);
        const selectedIndex = this.selectedCards.length - 1;
        this.selectedCards[selectedIndex].flipToFrontSide();
        if (selectedIndex % 2 !== 1) return;
        GameManager.getInstance().updateTurn();
        this.selectedCards[selectedIndex].flipToFrontSide(() => {
            if (!this.compareCard(this.selectedCards[selectedIndex - 1], this.selectedCards[selectedIndex])) {
                SoundManager.getInstance().playSound('reject');
                this.selectedCards[selectedIndex - 1].flipToBackSide();
                this.selectedCards[selectedIndex].flipToBackSide();
                return
            }
            SoundManager.getInstance().playSound('match');
            GameManager.getInstance().updatePoint();
            this.selectedCards[selectedIndex - 1].hiddenCard();
            this.selectedCards[selectedIndex].hiddenCard();
        });
    }

    onClearCards() {
        let children = this.node.children.slice();
        this.selectedCards = [];
        for (let child of children) {
            child.removeFromParent();
        }
    }
}

