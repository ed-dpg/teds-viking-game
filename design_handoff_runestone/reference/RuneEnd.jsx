// Runestone · End screen
// Big "Skál!" + carved score + play-again.

function RuneEndScreen({ rounds, totalScore, onPlayAgain }) {
  const maxScore = rounds.length * 100;
  const correctCount = rounds.filter((r) => r.result === 'won').length;
  const pct = maxScore ? totalScore / maxScore : 0;
  const verdict = pct >= 0.85 ? 'A saga worth remembering.'
                : pct >= 0.6  ? 'A respectable tally.'
                : pct >= 0.3  ? 'The skald may yet polish your name.'
                :               'The longhouse hears no songs tonight.';

  return (
    <div className="slate-panel" style={{ display: 'grid', gap: 18, justifyItems: 'center', textAlign: 'center', padding: '44px 32px 36px' }}>
      <div className="runic-band runic-band--top" style={{ padding: 0 }}>{RUNES.short}</div>
      <h1 className="rune-skal">Skál!</h1>
      <div className="rune-score-display">{totalScore} <span style={{ color: 'var(--bone-dim)', fontSize: '44px', fontWeight: 600, letterSpacing: '0.06em', textShadow: 'var(--carve-text-shadow)' }}>/ {maxScore}</span></div>
      <p className="rune-body" style={{ fontSize: 16, margin: 0 }}>
        {correctCount} of {rounds.length} relics named correctly.
      </p>
      <p className="rune-caption" style={{ fontStyle: 'italic', fontSize: 14, maxWidth: 480 }}>
        {verdict}
      </p>
      <button
        className="slate-tablet slate-tablet--primary"
        style={{ padding: '14px 30px', minWidth: 220, marginTop: 8, fontSize: 15 }}
        onClick={onPlayAgain}
      >Play again</button>
      <div className="runic-band runic-band--bottom" style={{ padding: 0 }}>{RUNES.short}</div>
    </div>
  );
}

window.RuneEndScreen = RuneEndScreen;
