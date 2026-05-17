// Runestone · Start screen
// Carved slate panel with three rune-style selects and a moss CTA.

const { useState: useStartState } = React;

function RuneStartScreen({ initialConfig, manifestSize, onBegin }) {
  const [roundCount, setRoundCount]   = useStartState(initialConfig.roundCount);
  const [optionCount, setOptionCount] = useStartState(initialConfig.optionCount);
  const [language, setLanguage]       = useStartState(initialConfig.language);
  const capped = roundCount > manifestSize;

  return (
    <div className="slate-panel" style={{ display: 'grid', gap: 20 }}>
      <div className="runic-band runic-band--top" style={{ textAlign: 'center', padding: 0 }}>{RUNES.short}</div>
      <div style={{ textAlign: 'center', display: 'grid', gap: 8 }}>
        <h1 className="rune-h1">Viking Image Guessing</h1>
        <p className="rune-caption" style={{ fontSize: 14, letterSpacing: '0.08em' }}>
          Three chances per round. Read the stones.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 8 }}>
        <div className="rune-field">
          <label htmlFor="rounds">Rounds</label>
          <select id="rounds" className="rune-select" value={roundCount}
                  onChange={(e) => setRoundCount(Number(e.target.value))}>
            <option value={5}>V · 5</option>
            <option value={10}>X · 10</option>
            <option value={15}>XV · 15</option>
          </select>
        </div>
        <div className="rune-field">
          <label htmlFor="options">Choices</label>
          <select id="options" className="rune-select" value={optionCount}
                  onChange={(e) => setOptionCount(Number(e.target.value))}>
            <option value={3}>III · 3</option>
            <option value={4}>IV · 4</option>
            <option value={5}>V · 5</option>
            <option value={6}>VI · 6</option>
          </select>
        </div>
        <div className="rune-field">
          <label htmlFor="lang">Tongue</label>
          <select id="lang" className="rune-select" value={language}
                  onChange={(e) => setLanguage(e.target.value)}>
            <option value="english">English</option>
            <option value="oldNorse">Old Norse</option>
          </select>
        </div>
      </div>

      {capped ? (
        <p className="rune-caption" style={{ fontStyle: 'italic', textAlign: 'center' }}>
          Only {manifestSize} relics catalogued — that's how many rounds you'll play.
        </p>
      ) : null}

      <button
        className="slate-tablet slate-tablet--primary"
        style={{ fontSize: 16, padding: '16px 24px', justifySelf: 'center', minWidth: 220 }}
        onClick={() => onBegin({ roundCount, optionCount, language })}
      >Begin the saga</button>

      <div className="runic-band runic-band--bottom" style={{ textAlign: 'center', padding: 0 }}>{RUNES.short}</div>
    </div>
  );
}

window.RuneStartScreen = RuneStartScreen;
