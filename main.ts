// The Meeting That Should Have Been an Email — make.fun entry.
// Writes one single-line joke (<= 200 chars) to /output/entry.txt.
//
// Revision (v2): instead of hard-coding one line, the program now scores
// three candidate lines against the judge's five published criteria
// (on-topic joke, laugh landing on its own with the turn at the last
// word, surprise, economy, recognition — each 0-2) and writes the
// winner. The scoring is deterministic: same input, same output, every
// run. The winner is the "nine pages of notes" line: its turn lands on
// the last two words ("see attached"), which is also the freshest angle
// — the meeting was so pointless that even its one-sentence summary was
// just a pointer to an attachment, an email in all but name.
import { mkdirSync, writeFileSync } from "node:fs";

type Candidate = {
  text: string;
  // Scores 0-2 per judge criterion, in the judge's published order:
  // [on-topic, standalone laugh, surprise, economy, recognition]
  scores: [number, number, number, number, number];
};

const CANDIDATES: Candidate[] = [
  {
    text: "We spent an hour in a meeting deciding what the first meeting was for, then booked a second one to confirm it.",
    scores: [2, 1, 2, 2, 2], // turn lands softly on "confirm it"; recursion is fresh
  },
  {
    text: "I took nine pages of notes in a meeting that could have been one sentence, and the sentence was 'see attached'.",
    scores: [2, 2, 2, 2, 2], // turn lands on the last words; freshest angle
  },
  {
    text: "Six of us spent an hour taking turns saying 'sorry, I was on mute' — that was the entire meeting.",
    scores: [2, 1, 1, 2, 2], // very recognizable, but the mute gag is the obvious one
  },
];

function total(c: Candidate): number {
  return c.scores.reduce((sum, s) => sum + s, 0);
}

// Highest total wins; ties break toward the shorter line, then the
// earliest listed, so the choice is fully deterministic.
const winner = [...CANDIDATES].sort(
  (a, b) => total(b) - total(a) || a.text.length - b.text.length,
)[0];
const LINE = winner.text;

if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${LINE.length}`);
}
if (LINE.trim() !== LINE || LINE.includes("\n")) {
  throw new Error("entry must be a single line with no surrounding whitespace");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");
console.log(`wrote ${LINE.length} chars to /output/entry.txt`);
