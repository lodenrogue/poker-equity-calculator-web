class Card {
    constructor(cardStr) {
        const rankMap = { 
            '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 
            'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 
        };
        this.cardStr = cardStr; 
        this.rankStr = cardStr[0];
        this.suit = cardStr[1];
        this.value = rankMap[this.rankStr];
    }

    getRank() { return { getValue: () => this.value }; }
    getSuit() { return this.suit; }
    toString() { return this.cardStr; }
}
