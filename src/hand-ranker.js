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

// --- Core Card Parser ---

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

// --- Comparators ---

class CardComparator {
    compare(hand1, hand2) { throw new Error("Not implemented"); }
}

class HighCardComparator extends CardComparator {
    compare(h1, h2) {
        const v1 = h1.map(c => c.getRank().getValue()).sort((a, b) => b - a);
        const v2 = h2.map(c => c.getRank().getValue()).sort((a, b) => b - a);
        for (let i = 0; i < 5; i++) {
            if (v1[i] > v2[i]) return 1;
            if (v1[i] < v2[i]) return -1;
        }
        return 0;
    }
}

class OnePairComparator extends CardComparator {
    findPair(hand) {
        const seen = new Set();
        for (const c of hand) {
            const v = c.getRank().getValue();
            if (seen.has(v)) return v;
            seen.add(v);
        }
        return 0;
    }
    compare(h1, h2) {
        const p1 = this.findPair(h1), p2 = this.findPair(h2);
        if (p1 !== p2) return p1 > p2 ? 1 : -1;
        const k1 = h1.map(c => c.getRank().getValue()).filter(v => v !== p1).sort((a, b) => b - a);
        const k2 = h2.map(c => c.getRank().getValue()).filter(v => v !== p2).sort((a, b) => b - a);
        for (let i = 0; i < 3; i++) {
            if (k1[i] > k2[i]) return 1;
            if (k1[i] < k2[i]) return -1;
        }
        return 0;
    }
}

class TwoPairComparator extends CardComparator {
    findPairs(hand) {
        const counts = {};
        hand.forEach(c => { const v = c.getRank().getValue(); counts[v] = (counts[v] || 0) + 1; });
        return Object.keys(counts).filter(v => counts[v] === 2).map(Number).sort((a, b) => b - a);
    }
    compare(h1, h2) {
        const p1 = this.findPairs(h1), p2 = this.findPairs(h2);
        for (let i = 0; i < 2; i++) {
            if (p1[i] > p2[i]) return 1;
            if (p1[i] < p2[i]) return -1;
        }
        const k1 = h1.map(c => c.getRank().getValue()).find(v => !p1.includes(v));
        const k2 = h2.map(c => c.getRank().getValue()).find(v => !p2.includes(v));
        return k1 > k2 ? 1 : k1 < k2 ? -1 : 0;
    }
}

class ThreeOfAKindComparator extends CardComparator {
    findTrip(hand) {
        const counts = {};
        hand.forEach(c => { const v = c.getRank().getValue(); counts[v] = (counts[v] || 0) + 1; });
        return Number(Object.keys(counts).find(v => counts[v] === 3));
    }
    compare(h1, h2) {
        const t1 = this.findTrip(h1), t2 = this.findTrip(h2);
        if (t1 !== t2) return t1 > t2 ? 1 : -1;
        const k1 = h1.map(c => c.getRank().getValue()).filter(v => v !== t1).sort((a, b) => b - a);
        const k2 = h2.map(c => c.getRank().getValue()).filter(v => v !== t2).sort((a, b) => b - a);
        for (let i = 0; i < 2; i++) {
            if (k1[i] > k2[i]) return 1;
            if (k1[i] < k2[i]) return -1;
        }
        return 0;
    }
}

class StraightComparator extends CardComparator {
    compare(h1, h2) {
        const v1 = HandRankUtils.getNumericValues(h1.map(c => c.getRank()), h1.some(c => c.getRank().getValue() === 2)).sort((a, b) => a - b);
        const v2 = HandRankUtils.getNumericValues(h2.map(c => c.getRank()), h2.some(c => c.getRank().getValue() === 2)).sort((a, b) => a - b);
        return v1[4] > v2[4] ? 1 : v1[4] < v2[4] ? -1 : 0;
    }
}

class FlushComparator extends HighCardComparator {}

class FullHouseComparator extends CardComparator {
    findTrip(hand) {
        const counts = {};
        hand.forEach(c => { const v = c.getRank().getValue(); counts[v] = (counts[v] || 0) + 1; });
        return Number(Object.keys(counts).find(v => counts[v] === 3));
    }
    findPair(hand, trip) {
        const counts = {};
        hand.forEach(c => { const v = c.getRank().getValue(); if(v !== trip) counts[v] = (counts[v] || 0) + 1; });
        return Number(Object.keys(counts).find(v => counts[v] === 2));
    }
    compare(h1, h2) {
        const t1 = this.findTrip(h1), t2 = this.findTrip(h2);
        if (t1 !== t2) return t1 > t2 ? 1 : -1;
        const p1 = this.findPair(h1, t1), p2 = this.findPair(h2, t2);
        return p1 > p2 ? 1 : p1 < p2 ? -1 : 0;
    }
}

class FourOfAKindComparator extends CardComparator {
    findQuad(hand) {
        const counts = {};
        hand.forEach(c => { const v = c.getRank().getValue(); counts[v] = (counts[v] || 0) + 1; });
        return Number(Object.keys(counts).find(v => counts[v] === 4));
    }
    compare(h1, h2) {
        const q1 = this.findQuad(h1), q2 = this.findQuad(h2);
        if (q1 !== q2) return q1 > q2 ? 1 : -1;
        const k1 = h1.map(c => c.getRank().getValue()).find(v => v !== q1);
        const k2 = h2.map(c => c.getRank().getValue()).find(v => v !== q2);
        return k1 > k2 ? 1 : k1 < k2 ? -1 : 0;
    }
}

class StraightFlushComparator extends StraightComparator {}

// --- Strategies ---

class RankStrategy { isRank(cards) { return false; } }

class OnePairStrategy extends RankStrategy {
    isRank(cards) {
        const vals = cards.map(c => c.getRank().getValue());
        return new Set(vals).size <= cards.length - 1;
    }
}

class TwoPairStrategy extends RankStrategy {
    isRank(cards) {
        const counts = {};
        cards.forEach(c => { const v = c.getRank().getValue(); counts[v] = (counts[v] || 0) + 1; });
        return Object.values(counts).filter(c => c === 2).length === 2;
    }
}

class ThreeOfAKindStrategy extends RankStrategy {
    isRank(cards) {
        const counts = {};
        cards.forEach(c => { const v = c.getRank().getValue(); counts[v] = (counts[v] || 0) + 1; });
        return Object.values(counts).some(c => c === 3);
    }
}

class StraightStrategy extends RankStrategy {
    isRank(cards) {
        if (!cards || cards.length !== 5) return false;
        const includes2 = cards.some(c => c.getRank().getValue() === 2);
        const v = HandRankUtils.getNumericValues(cards.map(c => c.getRank()), includes2).sort((a, b) => a - b);
        for (let i = 0; i < 4; i++) if (v[i] !== v[i + 1] - 1) return false;
        return true;
    }
}

class FlushStrategy extends RankStrategy {
    isRank(cards) {
        if (!cards || cards.length !== 5) return false;
        const suit = cards[0].getSuit();
        return cards.every(c => c.getSuit() === suit);
    }
}

class FullHouseStrategy extends RankStrategy {
    isRank(cards) {
        const counts = {};
        cards.forEach(c => { const v = c.getRank().getValue(); counts[v] = (counts[v] || 0) + 1; });
        const cVals = Object.values(counts);
        return cVals.includes(3) && cVals.includes(2);
    }
}

class FourOfAKindStrategy extends RankStrategy {
    isRank(cards) {
        const counts = {};
        cards.forEach(c => { const v = c.getRank().getValue(); counts[v] = (counts[v] || 0) + 1; });
        return Object.values(counts).some(c => c === 4);
    }
}

class StraightFlushStrategy extends RankStrategy {
    constructor() { super(); this.s = new StraightStrategy(); this.f = new FlushStrategy(); }
    isRank(cards) { return this.s.isRank(cards) && this.f.isRank(cards); }
}

// --- Main Utilities ---

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

    static getWinners(playersData, communityCardsStrings) {
        // Deck class must be available from your external file
        const deck = new Deck(); 
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
