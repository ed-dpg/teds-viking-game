// Shared Runestone primitives: icons, icon-tablet button,
// stone-aperture image frame, runic band strings, dot helpers.

const RUNES = {
  top:    'ᚦᚨᛞᛚᚱᛏᛒᚢᛜ',
  bottom: 'ᛟᛗᚲᛇᚷᛁᛉᚹᛊ',
  short:  'ᚱᛏᛒ',
};

function dots(attempt, result) {
  // dots used = attempts taken so far. After result resolves we show
  // the attempt count (final fill).
  const used = result === 'pending' ? attempt - 1 : attempt;
  return [1, 2, 3].map((n) => n <= used ? '●' : '○').join('');
}

function BackIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>;
}
function SoundOnIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05c1.48-.71 2.5-2.22 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>;
}
function SoundOffIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.59 3L19 9.41 17.59 8 15 10.59 12.41 8 11 9.41 13.59 12 11 14.59 12.41 16 15 13.41 17.59 16 19 14.59 16.59 12z"/>
  </svg>;
}

function IconTablet({ label, pressed, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed || undefined}
      onClick={onClick}
      className="icon-tablet"
    >{children}</button>
  );
}

// Image inside the chiseled stone aperture.
// attempt drives the zoom (1→4x, 2→2x, 3→1x). Focal point pinned per round.
function StoneAperture({ src, attempt, focal, showBands = true }) {
  const scale = ({ 1: 4, 2: 2, 3: 1 })[attempt];
  return (
    <div className="stone-aperture">
      {showBands ? <div className="runic-band runic-band--top">{RUNES.top}</div> : null}
      <div className="stone-window">
        <img
          src={src}
          alt=""
          onError={(e) => { e.currentTarget.src = '../../assets/image-placeholder.svg'; }}
          style={{
            transformOrigin: `${focal.x}% ${focal.y}%`,
            transform: `scale(${scale})`,
          }}
        />
        <div className="vignette"/>
        <div className="corner-moss bl"/>
        <div className="corner-moss tr"/>
      </div>
      {showBands ? <div className="runic-band runic-band--bottom">{RUNES.bottom}</div> : null}
    </div>
  );
}

Object.assign(window, { RUNES, dots, BackIcon, SoundOnIcon, SoundOffIcon, IconTablet, StoneAperture });
