// hooks/useGame.ts
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  AbondanceGame,
  MisereGame,
  GameContract,
  Card as LogicCard,
} from '@/app/lib/gamelogic'

export type CardType = { rank: LogicCard['rank']; suit: LogicCard['suit'] }
export type Bid = { player: number; mode: 'abondance' | 'misere'; trump?: LogicCard['suit'] }

export function useGame(playersCount: number, localBid: Bid) {
  const trumpOptions: LogicCard['suit'][] = ['♠','♥','♦','♣']

  // Bidding state
  const [bids, setBids] = useState<Bid[]>([])
  const [biddingComplete, setBiddingComplete] = useState(false)

  // Game instance ref
  const gameRef = useRef<GameContract | null>(null)

  // Play state
  const [hands, setHands] = useState<CardType[][]>([])
  const [trickCards, setTrickCards] = useState<Array<{ player: number; card: LogicCard }>>([])
  const [turn, setTurn] = useState(0)
  const [winnersHistory, setWinnersHistory] = useState<number[]>([])
  const [tricksWon, setTricksWon] = useState<number[]>(Array(playersCount).fill(0))
  const [showSummary, setShowSummary] = useState(false)
  const [summary, setSummary] = useState<{ success: boolean; score: number } | null>(null)

  // Deal and shuffle deck
  const dealHands = useCallback(() => {
    const suits = ['♠','♥','♦','♣'] as LogicCard['suit'][]
    const ranks = ['A','K','Q','J','10','9','8','7','6','5','4','3','2'] as LogicCard['rank'][]
    const deck: CardType[] = []
    suits.forEach(s => ranks.forEach(r => deck.push({ rank: r, suit: s })))
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }
    const per = 13
    const _hands: CardType[][] = []
    for (let p = 0; p < playersCount; p++) {
      _hands.push(deck.slice(p * per, p * per + per))
    }
    setHands(_hands)
  }, [playersCount])

  // Submit bid & start game
  const submitBid = useCallback(() => {
    const aiBids: Bid[] = []
    for (let p = 1; p < playersCount; p++) {
      const mode = Math.random() < 0.5 ? 'abondance' : 'misere'
      const trump = mode === 'abondance'
        ? trumpOptions[Math.floor(Math.random()*trumpOptions.length)]
        : undefined
      aiBids.push({ player: p, mode, trump })
    }
    const all = [localBid, ...aiBids]
    setBids(all)
    setBiddingComplete(true)

    const winBid = all.find(b => b.mode === 'abondance') || all[0]
    const inst = winBid.mode === 'misere'
      ? new MisereGame(playersCount)
      : new AbondanceGame(playersCount, winBid.trump!)
    gameRef.current = inst

    dealHands()
    setTurn(winBid.player)
  }, [localBid, playersCount, trumpOptions, dealHands])

  // Play card
  const playCard = useCallback((player: number, card: CardType) => {
    const game = gameRef.current
    if (!biddingComplete || !game || turn !== player) return
    setHands(prev => prev.map((h, i) =>
      i === player ? h.filter(c => c.rank !== card.rank || c.suit !== card.suit) : h
    ))
    game.playCard(player, { rank: card.rank as any, suit: card.suit })
    setTrickCards([...game.currentTrick])

    if (game.currentTrick.length === playersCount) {
      const full = [...game.currentTrick]
      setTrickCards(full)
      setTimeout(() => {
        const winner = game.finishTrick()
        setTricksWon([...game.tricksWon])
        setWinnersHistory(prev => [...prev, winner])
        setTurn(winner)
        setTrickCards([])
        if (game.isGameOver()) {
          const res = game.evaluate()
          setSummary(res)
          setShowSummary(true)
        }
      }, 1000)
    } else {
      setTurn(t => (t + 1)%playersCount)
    }
  }, [biddingComplete, turn, playersCount])

  // AI auto-play
  useEffect(() => {
    if (!biddingComplete || turn===0 || hands.length===0) return
    const t = setTimeout(() => {
      const aiHand = hands[turn]||[]
      if (aiHand.length) playCard(turn, aiHand[0])
    }, 600)
    return () => clearTimeout(t)
  }, [turn, biddingComplete, hands, playCard])

  // Player info
  const names = ['You','Alice','Bob','Charlie'].slice(0, playersCount)
  const declarerIdx = biddingComplete
    ? (bids.find(b=>b.mode==='abondance')?.player ?? bids[0].player)
    : 0
  const declarerBid = biddingComplete
    ? bids.find(b=>b.player===declarerIdx)
    : undefined

  const finishSummary = useCallback(() => {
    setShowSummary(false)
    setSummary(null)
  }, [])

  return {
    biddingComplete,
    bids,
    dealPreview: dealHands,
    submitBid,
    hands,
    trickCards,
    turn,
    winnersHistory,
    playCard,
    names,
    declarerIdx,
    declarerBid,
    showSummary,
    summary,
    finishSummary,
  }
}
