/** Layout for expanded home casts; the parent's style entry imports this after the resident defaults. */
export const HOME_CAST_STYLES = `
.ground-stage.home-cast .cast-slot { top: 65%; }
.ground-stage.home-cast .resident-spot.filled.left,
.ground-stage.home-cast .resident-spot.filled.right { z-index:1; width: 8.5em; height: 11em; animation: fw-home-cast-wander 18s ease-in-out infinite; transform: translate(-50%, -100%); }
@keyframes fw-home-cast-wander {
  0%, 100% { left: 22%; top: 65%; }
  30% { left: 78%; top: 35%; }
  65% { left: 60%; top: 80%; }
}

.editing-ground .ground-stage.home-cast .resident-spot.filled { animation-play-state:paused; }
@media(prefers-reduced-motion:reduce) {
 .ground-stage.home-cast .resident-spot.filled.left, .ground-stage.home-cast .resident-spot.filled.right { animation:none; }
}
`;
