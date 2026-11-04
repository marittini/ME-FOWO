/** Layout for expanded home casts; the parent's style entry imports this after the resident defaults. */
export const HOME_CAST_STYLES = `
.ground-stage.home-cast .cast-slot { top: 65%; }
.ground-stage.home-cast.cast-count-1 .cast-slot-0 { left: 50%; }
.ground-stage.home-cast.cast-count-2 .cast-slot-0 { left: 28%; }
.ground-stage.home-cast.cast-count-2 .cast-slot-1 { left: 72%; }
.ground-stage.home-cast.cast-count-3 .cast-slot-0 { left: 20%; }
.ground-stage.home-cast.cast-count-3 .cast-slot-1 { left: 50%; }
.ground-stage.home-cast.cast-count-3 .cast-slot-2 { left: 80%; }
.ground-stage.home-cast.cast-count-4 .cast-slot-0, .ground-stage.home-cast.cast-count-4 .cast-slot-3 { left: 30%; }
.ground-stage.home-cast.cast-count-4 .cast-slot-1, .ground-stage.home-cast.cast-count-4 .cast-slot-2 { left: 70%; }
.ground-stage.home-cast.cast-count-4 .cast-slot-2, .ground-stage.home-cast.cast-count-4 .cast-slot-3,
.ground-stage.home-cast.cast-count-5 .cast-slot-3, .ground-stage.home-cast.cast-count-5 .cast-slot-4,
.ground-stage.home-cast.cast-count-6 .cast-slot-3, .ground-stage.home-cast.cast-count-6 .cast-slot-4,
.ground-stage.home-cast.cast-count-6 .cast-slot-5 { top: 100%; }
.ground-stage.home-cast.cast-count-5 .cast-slot-0, .ground-stage.home-cast.cast-count-5 .cast-slot-3,
.ground-stage.home-cast.cast-count-6 .cast-slot-0, .ground-stage.home-cast.cast-count-6 .cast-slot-3 { left: 18%; }
.ground-stage.home-cast.cast-count-5 .cast-slot-1, .ground-stage.home-cast.cast-count-5 .cast-slot-4,
.ground-stage.home-cast.cast-count-6 .cast-slot-1, .ground-stage.home-cast.cast-count-6 .cast-slot-4 { left: 50%; }
.ground-stage.home-cast.cast-count-5 .cast-slot-2,
.ground-stage.home-cast.cast-count-6 .cast-slot-2, .ground-stage.home-cast.cast-count-6 .cast-slot-5 { left: 82%; }
.ground-stage.home-cast.cast-count-3 .resident-spot.filled,
.ground-stage.home-cast.cast-count-4 .resident-spot.filled,
.ground-stage.home-cast.cast-count-5 .resident-spot.filled,
.ground-stage.home-cast.cast-count-6 .resident-spot.filled { width: 5.5em; height: 7.2em; animation: fw-cast-wander 12s ease-in-out infinite; }
.ground-stage.home-cast.cast-count-4 .resident-spot,
.ground-stage.home-cast.cast-count-5 .resident-spot,
.ground-stage.home-cast.cast-count-6 .resident-spot { transform: translate(-50%, -100%); }
.ground-stage.home-cast.cast-count-3 .resident-spot { transform: translate(-50%, -100%); }
@keyframes fw-cast-wander { 0%, 20%, 95%, 100% { transform: translate(-50%, -100%) translateX(-3px); } 45%, 70% { transform: translate(-50%, -100%) translateX(3px); } }

.editing-ground .ground-stage.home-cast .resident-spot.filled { animation-play-state:paused; }
@media(prefers-reduced-motion:reduce) {
 .ground-stage.home-cast .resident-spot.filled.left, .ground-stage.home-cast .resident-spot.filled.right { animation:none; }
}
`;
