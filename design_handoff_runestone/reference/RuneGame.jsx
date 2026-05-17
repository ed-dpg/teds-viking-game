// Runestone · Game screen
// Header (round/score/dots/icons) · stone aperture · option tablets · result.

const { useState: useGameState } = React;

function RuneGameScreen({ round, roundNumber, totalRounds, totalScore, language, onGuess, onNext, onExit }) {
  const [muted, setMuted] = useGameState(false);

  const displayName = (t) => language === 'oldNorse' ? t.oldNorse : t.name;

  function tabletClass(option) {
    if ((round.result === 'won' || round.result === 'lost') && option.id === round.answer.id) {
      return 'slate-tablet slate-tablet--correct';
    }
    if (round.picked.includes(option.id)) {
      return 'slate-tablet slate-tablet--wrong';
    }
    return 'slate-tablet';
  }
  const isDisabled = (option) =>
    round.result !== 'pending' || round.picked.includes(option.id);

  function handleExit() {
    if (window.confirm('Exit to menu? Your current saga will be lost.')) onExit();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <header className="rune-header">
        <span className="rune-stat">Round {roundNumber} / {totalRounds}</span>
        <span className="rune-stat">Score: {totalScore}</span>
        <span className="rune-dots" aria-label="Attempts used">{dots(round.attempt, round.result)}</span>
        <IconTablet label="Exit to menu" onClick={handleExit}><BackIcon/></IconTablet>
        <IconTablet label={muted ? 'Unmute sound' : 'Mute sound'}
                    pressed={muted}
                    onClick={() => setMuted((m) => !m)}>
          {muted ? <SoundOffIcon/> : <SoundOnIcon/>}
        </IconTablet>
      </header>

      <div className="rune-grid">
        <StoneAperture
          key={round.answer.id}
          src={round.answer.image}
          attempt={round.attempt}
          focal={round.focal}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="rune-options">
            {round.options.map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isDisabled(option)}
                onClick={() => onGuess(option)}
                className={tabletClass(option)}
              >{displayName(option)}</button>
            ))}
          </div>

          {round.result === 'pending' ? (
            <p className="rune-caption" style={{ fontStyle: 'italic', padding: '0 4px' }}>
              {round.attempt === 1 && 'A first guess scores the most. Be sure of it.'}
              {round.attempt === 2 && 'Each wrong stroke widens the view.'}
              {round.attempt === 3 && 'One stone remains. Strike true.'}
            </p>
          ) : (
            <div className={'rune-result' + (round.result === 'lost' ? ' rune-result--lost' : '')}>
              <div className="verdict">
                {round.result === 'won'
                  ? <>Correct · +{round.pointsEarned}</>
                  : <>Out of guesses</>}
              </div>
              <p className="rune-body" style={{ margin: 0 }}>
                {round.result === 'lost' && language === 'oldNorse' ? (
                  <>It was a <em>{round.answer.oldNorse}</em> ({round.answer.name}). {round.answer.description}</>
                ) : round.result === 'lost' ? (
                  <>It was a <em>{round.answer.name}</em>. {round.answer.description}</>
                ) : (
                  round.answer.description
                )}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="slate-tablet slate-tablet--primary"
                  style={{ padding: '10px 22px', minWidth: 140, fontSize: 14 }}
                  onClick={onNext}
                >{roundNumber < totalRounds ? 'Next stone' : 'See results'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.RuneGameScreen = RuneGameScreen;
