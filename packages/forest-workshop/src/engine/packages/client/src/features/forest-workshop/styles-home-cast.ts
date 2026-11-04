/** Layout for expanded home casts; the parent's style entry imports this after the resident defaults. */
export const HOME_CAST_STYLES = `
.ground-stage.home-cast .cast-slot { top: 65%; }
.ground-stage.home-cast .resident-spot.filled.left,
.ground-stage.home-cast .resident-spot.filled.right { z-index:1; width: 8.5em; height: 11em; animation: fw-home-cast-wander 42s ease-in-out infinite; transform: translate(-50%, -100%); }
@keyframes fw-home-cast-wander {
  0%, 100% { left: 22%; top: 65%; z-index: 650; }
  30% { left: 78%; top: 35%; z-index: 350; }
  65% { left: 60%; top: 80%; z-index: 800; }
}

.ground-stage.home-cast .resident-spot.filled .figure { animation: fw-home-cast-facing 42s steps(1,end) infinite; animation-delay:var(--cast-delay, -4s); }
@keyframes fw-home-cast-facing {
  0%, 30% { transform: scaleX(1); }
  30.01%, 100% { transform: scaleX(-1); }
}

.editing-ground .ground-stage.home-cast .resident-spot.filled, .editing-ground .ground-stage.home-cast .resident-spot.filled .figure { animation-play-state:paused; }
@media(prefers-reduced-motion:reduce) {
 .ground-stage.home-cast .resident-spot.filled.left, .ground-stage.home-cast .resident-spot.filled.right, .ground-stage.home-cast .resident-spot.filled .figure { animation:none; }
}
`;
