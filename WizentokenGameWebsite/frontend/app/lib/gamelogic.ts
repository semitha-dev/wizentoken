// lib/gameLogic.ts
export type Suit = '♠' | '♥' | '♦' | '♣'
export type Rank = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2'
export type Card = { rank: Rank; suit: Suit }
export type GameMode = 'abondance' | 'misere'

// Utility: rank strength mapping
const rankValue: Record<Rank, number> = {
  'A': 14, 'K': 13, 'Q': 12, 'J': 11,
  '10': 10, '9': 9, '8': 8, '7': 7, '6': 6,
  '5': 5, '4': 4, '3': 3, '2': 2,
}

export interface GameContract {
  mode: GameMode
  trumpSuit?: Suit
  currentTrick: Array<{ player: number; card: Card }>
  tricksWon: number[]        // index by player
  playCard(player: number, card: Card): boolean
  finishTrick(): number      // returns winning player
  isGameOver(): boolean
  evaluate(): { success: boolean; score: number }
}

/**
 * Abondance: solo game. Player chooses trump. Goal: win >=9 tricks.
 * Scoring: success +5, failure -5.
 */
export class AbondanceGame implements GameContract {
  mode: GameMode = 'abondance'
  trumpSuit: Suit
  currentTrick: Array<{ player: number; card: Card }> = []
  tricksWon: number[]
  totalTricks = 13

  constructor(public playersCount: number, trumpSuit: Suit) {
    this.trumpSuit = trumpSuit
    this.tricksWon = Array(playersCount).fill(0)
  }

  playCard(player: number, card: Card): boolean {
    // enforce follow suit if possible
    if (this.currentTrick.length > 0) {
      const leadSuit = this.currentTrick[0].card.suit
      const hasLeadSuit = false // UI must tell if player has lead suit
      // for now allow all plays
    }
    this.currentTrick.push({ player, card })
    return true
  }

  finishTrick(): number {
    if (this.currentTrick.length === 0) throw new Error("No cards to evaluate")
    // determine winner
    let winner = this.currentTrick[0].player
    let bestCard = this.currentTrick[0].card
    for (let i = 1; i < this.currentTrick.length; i++) {
      const { player, card } = this.currentTrick[i]
      const isTrump = card.suit === this.trumpSuit
      const bestIsTrump = bestCard.suit === this.trumpSuit
      if (isTrump && !bestIsTrump) {
        winner = player; bestCard = card
      } else if ((card.suit === bestCard.suit || (!bestIsTrump && !isTrump && card.suit === this.currentTrick[0].card.suit))
                 && rankValue[card.rank] > rankValue[bestCard.rank]) {
        winner = player; bestCard = card
      }
    }
    this.tricksWon[winner]++
    this.currentTrick = []
    return winner
  }

  isGameOver(): boolean {
    // after totalTricks have been won by someone
    const sum = this.tricksWon.reduce((a, b) => a + b, 0)
    return sum >= this.totalTricks
  }

  evaluate() {
    const won = this.tricksWon[0]
    const success = won >= 9
    return { success, score: success ? 5 : -5 }
  }
}

/**
 * Misere: solo game. No trump. Goal: win 0 tricks.
 * Scoring: success +15, failure -15.
 */
export class MisereGame implements GameContract {
  mode: GameMode = 'misere'
  currentTrick: Array<{ player: number; card: Card }> = []
  tricksWon: number[]
  totalTricks = 13

  constructor(public playersCount: number) {
    this.tricksWon = Array(playersCount).fill(0)
  }

  playCard(player: number, card: Card): boolean {
    // no trump, any play allowed, but enforce follow suit if possible
    this.currentTrick.push({ player, card })
    return true
  }

  finishTrick(): number {
    // determine winner by highest of lead suit
    if (this.currentTrick.length === 0) throw new Error("No cards to evaluate")
    const leadSuit = this.currentTrick[0].card.suit
    let winner = this.currentTrick[0].player
    let bestCard = this.currentTrick[0].card
    for (let i = 1; i < this.currentTrick.length; i++) {
      const { player, card } = this.currentTrick[i]
      if (card.suit === leadSuit && rankValue[card.rank] > rankValue[bestCard.rank]) {
        winner = player; bestCard = card
      }
    }
    this.tricksWon[winner]++
    this.currentTrick = []
    return winner
  }

  isGameOver(): boolean {
    const sum = this.tricksWon.reduce((a, b) => a + b, 0)
    return sum >= this.totalTricks
  }

  evaluate() {
    const won = this.tricksWon[0]
    const success = won === 0
    return { success, score: success ? 15 : -15 }
  }
}
