/** Layout for expanded home casts; the parent's style entry imports this after the resident defaults. */
export const HOME_CAST_STYLES = `
.ground-stage.home-cast .cast-slot { top: 65%; }
.ground-stage.home-cast .resident-spot.filled.left,
.ground-stage.home-cast .resident-spot.filled.right { z-index:1; width: 8.5em; height: 11em; transform: translate(-50%, -100%); }

.ground-stage.home-cast .cast-slot-0.resident-spot.filled { animation: fw-home-cast-route-0 42s ease-in-out infinite; }
.ground-stage.home-cast .cast-slot-1.resident-spot.filled { animation: fw-home-cast-route-1 42s ease-in-out infinite; }
.ground-stage.home-cast .cast-slot-2.resident-spot.filled { animation: fw-home-cast-route-2 42s ease-in-out infinite; }
.ground-stage.home-cast .cast-slot-3.resident-spot.filled { animation: fw-home-cast-route-3 42s ease-in-out infinite; }
.ground-stage.home-cast .cast-slot-4.resident-spot.filled { animation: fw-home-cast-route-4 42s ease-in-out infinite; }
.ground-stage.home-cast .cast-slot-5.resident-spot.filled { animation: fw-home-cast-route-5 42s ease-in-out infinite; }

.ground-stage.home-cast .cast-slot-0.resident-spot.filled .figure { animation: fw-home-cast-facing-0 42s steps(1,end) infinite; animation-delay:var(--cast-delay, -4s); }
.ground-stage.home-cast .cast-slot-1.resident-spot.filled .figure { animation: fw-home-cast-facing-1 42s steps(1,end) infinite; animation-delay:var(--cast-delay, -4s); }
.ground-stage.home-cast .cast-slot-2.resident-spot.filled .figure { animation: fw-home-cast-facing-2 42s steps(1,end) infinite; animation-delay:var(--cast-delay, -4s); }
.ground-stage.home-cast .cast-slot-3.resident-spot.filled .figure { animation: fw-home-cast-facing-3 42s steps(1,end) infinite; animation-delay:var(--cast-delay, -4s); }
.ground-stage.home-cast .cast-slot-4.resident-spot.filled .figure { animation: fw-home-cast-facing-4 42s steps(1,end) infinite; animation-delay:var(--cast-delay, -4s); }
.ground-stage.home-cast .cast-slot-5.resident-spot.filled .figure { animation: fw-home-cast-facing-5 42s steps(1,end) infinite; animation-delay:var(--cast-delay, -4s); }

@keyframes fw-home-cast-route-0 {
  0%, 100% { left:22%; top:65%; z-index:650; }
  25% { left:48%; top:48%; z-index:480; }
  50% { left:78%; top:35%; z-index:350; }
  75% { left:60%; top:80%; z-index:800; }
}
@keyframes fw-home-cast-route-1 {
  0%, 100% { left:78%; top:65%; z-index:650; }
  25% { left:54%; top:80%; z-index:800; }
  50% { left:22%; top:58%; z-index:580; }
  75% { left:40%; top:35%; z-index:350; }
}
@keyframes fw-home-cast-route-2 {
  0%, 100% { left:40%; top:80%; z-index:800; }
  25% { left:22%; top:52%; z-index:520; }
  50% { left:52%; top:35%; z-index:350; }
  75% { left:78%; top:55%; z-index:550; }
}
@keyframes fw-home-cast-route-3 {
  0%, 100% { left:60%; top:35%; z-index:350; }
  25% { left:78%; top:52%; z-index:520; }
  50% { left:48%; top:80%; z-index:800; }
  75% { left:22%; top:60%; z-index:600; }
}
@keyframes fw-home-cast-route-4 {
  0%, 100% { left:30%; top:48%; z-index:480; }
  25% { left:68%; top:35%; z-index:350; }
  50% { left:78%; top:72%; z-index:720; }
  75% { left:40%; top:80%; z-index:800; }
}
@keyframes fw-home-cast-route-5 {
  0%, 100% { left:70%; top:80%; z-index:800; }
  25% { left:36%; top:62%; z-index:620; }
  50% { left:22%; top:35%; z-index:350; }
  75% { left:56%; top:48%; z-index:480; }
}

@keyframes fw-home-cast-facing-0 { 0% { transform:scaleX(1); } 50% { transform:scaleX(-1); } 100% { transform:scaleX(1); } }
@keyframes fw-home-cast-facing-1 { 0% { transform:scaleX(-1); } 50% { transform:scaleX(1); } 100% { transform:scaleX(-1); } }
@keyframes fw-home-cast-facing-2 { 0% { transform:scaleX(-1); } 25% { transform:scaleX(1); } 75%, 100% { transform:scaleX(-1); } }
@keyframes fw-home-cast-facing-3 { 0% { transform:scaleX(1); } 25% { transform:scaleX(-1); } 75%, 100% { transform:scaleX(1); } }
@keyframes fw-home-cast-facing-4 { 0% { transform:scaleX(1); } 50% { transform:scaleX(-1); } 100% { transform:scaleX(1); } }
@keyframes fw-home-cast-facing-5 { 0% { transform:scaleX(-1); } 50% { transform:scaleX(1); } 100% { transform:scaleX(-1); } }

.editing-ground .ground-stage.home-cast .resident-spot.filled, .editing-ground .ground-stage.home-cast .resident-spot.filled .figure { animation-play-state:paused; }
@media(prefers-reduced-motion:reduce) {
 .ground-stage.home-cast .cast-slot.resident-spot.filled.left, .ground-stage.home-cast .cast-slot.resident-spot.filled.right, .ground-stage.home-cast .cast-slot.resident-spot.filled .figure { animation:none; }
}
`;
