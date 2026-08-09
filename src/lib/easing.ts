import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

// cubic-bezier(0.9, 0, 0.1, 1) — GSAP's CustomEase path maps CSS bezier
// control points (x1,y1,x2,y2) directly: M0,0 C{x1},{y1} {x2},{y2} 1,1
CustomEase.create("buttonEase", "M0,0,C0.9,0,0.1,1,1,1");

// Shared sharp snap-in-place curve, used by any GSAP tween that wants it
// (currently: Button hover, AboutOverlay slide).
export const SHARP_EASE = "buttonEase";
