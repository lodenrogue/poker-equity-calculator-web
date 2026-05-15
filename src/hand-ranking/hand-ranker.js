// --- Constants ---
const HandRank = {
    STRAIGHT_FLUSH: 8,
    FOUR_OF_A_KIND: 7,
    FULL_HOUSE: 6,
    FLUSH: 5,
    STRAIGHT: 4,
    THREE_OF_A_KIND: 3,
    TWO_PAIR: 2,
    ONE_PAIR: 1,
    HIGH_CARD: 0
};

class HandRankUtils {
    static dealHoleCards(deck, players) {
        for (let player of players) {
            // Check if player.hand is "random"
            const isRandom = player.hand?.includes("random");
            
            if (isRandom) {
                // Draw 2 new cards and parse them
                player.hand = [
                    new Card(deck.draw()),
                    new Card(deck.draw())
                ];
            } else if (Array.isArray(player.hand)) {
                // Ensure existing strings are converted to Card objects
                player.hand = player.hand.map(cStr => {
                    // Safety check to ensure we only parse strings
                    return cStr instanceof Card ? cStr : new Card(cStr);
                });
            }
        }
    }

    static getWinners(playersData, communityCardsStrings, deck) {
        // Deck class must be available from your external file
        deck.shuffle();

        // Parse community cards (passed as strings)
        const communityCards = communityCardsStrings.map(cStr => {
            deck.remove(cStr); // Remove from deck
            return new Card(cStr);
        });

        // Deep copy players to avoid UI mutation
        const players = JSON.parse(JSON.stringify(playersData));
        this.dealHoleCards(deck, players);

        const processedHands = players.map(p => {
            return {
                player: p,
                bestHand: this.findBestHand([...p.hand, ...communityCards])
            };
        });

        let winners = [processedHands[0]];

        for (let i = 1; i < processedHands.length; i++) {
            const res = this.compare(winners[0].bestHand, processedHands[i].bestHand);
            if (res === -1) {
                winners = [processedHands[i]];
            } else if (res === 0) {
                winners.push(processedHands[i]);
            }
        }

        return winners.map(w => w.player);
    }

    static findBestHand(cards) {
        if (!cards || cards.length < 5) return [];
        const combinations = this.getCombinations(cards, 5, 0, [], []);
        let best = combinations[0];
        for (let i = 1; i < combinations.length; i++) {
            if (this.compare(best, combinations[i]) === -1) best = combinations[i];
        }
        return best;
    }

    static compare(h1, h2) {
        if (!h1 || h1.length === 0) return -1;
        if (!h2 || h2.length === 0) return 1;
        const r1 = this.findRank(h1), r2 = this.findRank(h2);
        if (r1 !== r2) return r1 > r2 ? 1 : -1;

        const comps = {
            [HandRank.STRAIGHT_FLUSH]: new StraightFlushComparator(),
            [HandRank.FOUR_OF_A_KIND]: new FourOfAKindComparator(),
            [HandRank.FULL_HOUSE]: new FullHouseComparator(),
            [HandRank.FLUSH]: new FlushComparator(),
            [HandRank.STRAIGHT]: new StraightComparator(),
            [HandRank.THREE_OF_A_KIND]: new ThreeOfAKindComparator(),
            [HandRank.TWO_PAIR]: new TwoPairComparator(),
            [HandRank.ONE_PAIR]: new OnePairComparator(),
            [HandRank.HIGH_CARD]: new HighCardComparator()
        };
        return comps[r1].compare(h1, h2);
    }

    static findRank(cards) {
        const strats = [
            {s: new StraightFlushStrategy(), r: HandRank.STRAIGHT_FLUSH},
            {s: new FourOfAKindStrategy(), r: HandRank.FOUR_OF_A_KIND},
            {s: new FullHouseStrategy(), r: HandRank.FULL_HOUSE},
            {s: new FlushStrategy(), r: HandRank.FLUSH},
            {s: new StraightStrategy(), r: HandRank.STRAIGHT},
            {s: new ThreeOfAKindStrategy(), r: HandRank.THREE_OF_A_KIND},
            {s: new TwoPairStrategy(), r: HandRank.TWO_PAIR},
            {s: new OnePairStrategy(), r: HandRank.ONE_PAIR}
        ];
        for (let strat of strats) if (strat.s.isRank(cards)) return strat.r;
        return HandRank.HIGH_CARD;
    }

    static getCombinations(cards, r, start, data, destination) {
        if (data.length === r) { destination.push([...data]); return destination; }
        for (let i = start; i < cards.length && (cards.length - i >= r - data.length); i++) {
            data.push(cards[i]);
            this.getCombinations(cards, r, i + 1, data, destination);
            data.pop();
        }
        return destination;
    }

    static getNumericValues(ranks, includes2) {
        return ranks.map(r => (r.getValue() === 14 && includes2) ? 1 : r.getValue());
    }
}
