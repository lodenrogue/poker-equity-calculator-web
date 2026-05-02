class Game {

    evaluate(players, board) {
        if (players.length == 0) {
            return "0%";
        }

        let playerWins = 0;
        const iterations = 10000;

        for (let i = 0; i < iterations; i++) {
            const deck = new Deck();
            deck.shuffle();

            this.removePlayerHandsFromDeck(deck, players);
            this.removeBoardCardsFromDeck(deck, board);

            const communityCards = this.getCommunityCards(deck, board);
            const winners = HandRankUtils.getWinners(players, communityCards);
            const playerOneWon = winners.some(w => w.id === 1);

            if (playerOneWon) {
                playerWins++;
            }
        }

        // Return win percentage formatted to 2 decimal places
        return ((playerWins / iterations) * 100).toFixed(0) + "%";
    }

    isRandomHand(hand) {
        return Array.isArray(hand) && hand[0] === "random";
    }

    removePlayerHandsFromDeck(deck, players) {
        for (let pIndex in players) {
            const playerHand = players[pIndex].hand;

            if (this.isRandomHand(playerHand)) continue;

            if (playerHand[0]) deck.remove(playerHand[0]);
            if (playerHand[1]) deck.remove(playerHand[1]);
        }
    }

    removeBoardCardsFromDeck(deck, board) {
        for (let bIndex in board) {
            const card = board[bIndex];
            deck.remove(card);
        }
    }

    getCommunityCards(deck, board) {
        const communityCards = [...board];
        while (communityCards.length < 5) {
            communityCards.push(deck.draw());
        }
        return communityCards;
    }
}
