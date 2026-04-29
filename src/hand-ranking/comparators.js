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
