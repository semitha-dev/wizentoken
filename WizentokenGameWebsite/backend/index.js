import express from "express";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const supabase = createClient(
  "https://deigudfjqqcimwxfnqdz.supabase.co",
  "YOUR_SERVICE_ROLE_KEY"
);

function decideWinner(moves, trumpSuit) {
  const trumpOrder = ["J","9","A","K","Q","10","8","7","6","5","4","3","2"];
  const normalOrder = ["A","K","Q","J","10","9","8","7","6","5","4","3","2"];
  const leadSuit = moves[0].card.suit;
  const trumpMoves = moves.filter(m => m.card.suit === trumpSuit);
  const pool = trumpMoves.length
    ? trumpMoves
    : moves.filter(m => m.card.suit === leadSuit);
  const order = trumpMoves.length ? trumpOrder : normalOrder;
  return pool.reduce((best, cur) =>
    order.indexOf(cur.card.rank) > order.indexOf(best.card.rank) ? cur : best
  ).player_id;
}

// START GAME: deal into hands.player_id = players.id
app.post("/start-game", async (req, res) => {
  const { gameId } = req.body;
  try {
    const { data: players } = await supabase
      .from("players")
      .select("id")          // <-- players.id
      .eq("game_id", gameId);

    if (!players || players.length !== 4) {
      return res.status(400).json({ error: "Need exactly 4 players" });
    }

    // build & shuffle deck
    const suits = ["hearts","diamonds","clubs","spades"];
    const ranks = ["A","K","Q","J","10","9","8","7","6","5","4","3","2"];
    let deck = suits.flatMap(s => ranks.map(r => ({ suit: s, rank: r })));
    deck.sort(() => Math.random() - 0.5);

    // deal 13 each into hands.table
    const hands = players.map((p, i) => ({
      game_id: gameId,
      player_id: p.id,      // <-- use players.id, not user_id
      cards: deck.slice(i*13, (i+1)*13)
    }));
    await supabase.from("hands").insert(hands);

    // activate game
    await supabase
      .from("games")
      .update({
        status: "active",
        current_turn: players[0].id,   // players.id
        mode: "Vraag & Meegaan",
        trump_suit: "hearts",
        declarer_id: players[0].id
      })
      .eq("id", gameId);

    res.json({ message: "Game started" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PLAY CARD
app.post("/play-card", async (req, res) => {
  const { gameId, playerId, card, roundNumber } = req.body;
  try {
    const { data: game } = await supabase
      .from("games")
      .select("current_turn, trump_suit")
      .eq("id", gameId)
      .single();

    if (!game || game.current_turn !== playerId) {
      return res.status(400).json({ error: "Not your turn" });
    }

    const { data: handRow } = await supabase
      .from("hands")
      .select("cards")
      .eq("game_id", gameId)
      .eq("player_id", playerId)
      .single();

    if (!handRow) return res.status(400).json({ error: "Hand not found" });

    const exists = handRow.cards.find(c => c.suit===card.suit && c.rank===card.rank);
    if (!exists) return res.status(400).json({ error: "Card not in hand" });

    // record
    const { data: move } = await supabase
      .from("moves")
      .insert([{ game_id: gameId, player_id: playerId, card, round_number: roundNumber }])
      .select()
      .single();

    // remove from hand
    const newHand = handRow.cards.filter(c => !(c.suit===card.suit && c.rank===card.rank));
    await supabase
      .from("hands")
      .update({ cards: newHand })
      .eq("game_id", gameId)
      .eq("player_id", playerId);

    // when 4 moves done...
    const { data: moves } = await supabase
      .from("moves")
      .select("*")
      .eq("game_id", gameId)
      .eq("round_number", roundNumber);

    if (moves.length === 4) {
      const winnerId = decideWinner(moves, game.trump_suit);
      await supabase.from("rounds").insert([{
        game_id: gameId,
        round_number: roundNumber,
        winner_id: winnerId,
        points_awarded: 1
      }]);
      await supabase
        .from("games")
        .update({ current_turn: winnerId })
        .eq("id", gameId);
    }

    res.json(move);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GAME STATE: pass playerId = players.id
app.get("/game-state/:gameId/:playerId", async (req, res) => {
  const { gameId, playerId } = req.params;
  try {
    const { data: hand } = await supabase
      .from("hands")
      .select("cards")
      .eq("game_id", gameId)
      .eq("player_id", playerId)
      .single();

    const { data: moves } = await supabase
      .from("moves")
      .select("*")
      .eq("game_id", gameId);

    const { data: rounds } = await supabase
      .from("rounds")
      .select("*")
      .eq("game_id", gameId);

    const { data: game } = await supabase
      .from("games")
      .select("mode, trump_suit, declarer_id, current_turn")
      .eq("id", gameId)
      .single();

    res.json({ hand, moves, rounds, game });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
