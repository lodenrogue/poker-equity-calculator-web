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
