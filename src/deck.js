class Deck {

    constructor() {
	this.cards = this.createDeck();
    }

    createDeck() {
	const suits = ["c", "h", "s", "d"];
	const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];

	const deck = [];
	
	for(let sIndex in suits) {
	    for(let rIndex in ranks) {
		deck.push(`${ranks[rIndex]}${suits[sIndex]}`);
	    }
	}
	return deck;

    }

    shuffle() {
	for(let i = this.cards.length - 1; i > 0; i--) {
	    const randomPosition = Math.floor(Math.random() * (i + 1));
	    const randomCard = this.cards[randomPosition];
	    const movedCard = this.cards[i];

	    this.cards[i] = randomCard;
	    this.cards[randomPosition] = movedCard;
	}
    }

    remove(cardToRemove) {
	this.cards = this.cards.filter(card => card != cardToRemove);
    }

    draw() {
	return this.cards.pop();
    }

}
