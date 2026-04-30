#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN_ROOT = path.join(ROOT, "com.asuka.rectangle.sdPlugin");
const OUT_PLUGIN = path.join(PLUGIN_ROOT, "imgs/plugin");
const OUT_ACTIONS = path.join(PLUGIN_ROOT, "imgs/actions");

mkdirSync(OUT_PLUGIN, { recursive: true });
mkdirSync(OUT_ACTIONS, { recursive: true });

const COLOR_BG = "#0d0d0d";
const COLOR_FRAME = "#3f3f46";
const COLOR_FILL = "#4f8cff";
const COLOR_FILL_MUTED = "#1e3a8a";
const COLOR_FG_MONO = "#ffffff";

const FRAME_INSET = 14;

const ACTIONS = [
	{ name: "left-half",        layout: "halfLeft"       },
	{ name: "right-half",       layout: "halfRight"      },
	{ name: "top-half",         layout: "halfTop"        },
	{ name: "bottom-half",      layout: "halfBottom"     },
	{ name: "top-left",         layout: "quarterTL"      },
	{ name: "top-right",        layout: "quarterTR"      },
	{ name: "bottom-left",      layout: "quarterBL"      },
	{ name: "bottom-right",     layout: "quarterBR"      },
	{ name: "first-third",      layout: "thirdL"         },
	{ name: "center-third",     layout: "thirdC"         },
	{ name: "last-third",       layout: "thirdR"         },
	{ name: "first-two-thirds", layout: "twoThirdsL"     },
	{ name: "last-two-thirds",  layout: "twoThirdsR"     },
	{ name: "top-left-sixth",      layout: "sixthTL"     },
	{ name: "top-center-sixth",    layout: "sixthTC"     },
	{ name: "top-right-sixth",     layout: "sixthTR"     },
	{ name: "bottom-left-sixth",   layout: "sixthBL"     },
	{ name: "bottom-center-sixth", layout: "sixthBC"     },
	{ name: "bottom-right-sixth",  layout: "sixthBR"     },
	{ name: "maximize",         layout: "maximize"       },
	{ name: "almost-maximize",  layout: "almostMaximize" },
	{ name: "center",           layout: "center"         },
	{ name: "center-half",      layout: "centerHalf"     },
	{ name: "restore",          layout: "restore"        },
	{ name: "larger",           layout: "larger"         },
	{ name: "smaller",          layout: "smaller"        },
	{ name: "next-display",     layout: "displayNext"    },
	{ name: "previous-display", layout: "displayPrev"    },
];

function fillRectForLayout(layout, frame) {
	const { x, y, w, h } = frame;
	switch (layout) {
		case "halfLeft":       return { x, y, w: w / 2, h };
		case "halfRight":      return { x: x + w / 2, y, w: w / 2, h };
		case "halfTop":        return { x, y, w, h: h / 2 };
		case "halfBottom":     return { x, y: y + h / 2, w, h: h / 2 };
		case "quarterTL":      return { x, y, w: w / 2, h: h / 2 };
		case "quarterTR":      return { x: x + w / 2, y, w: w / 2, h: h / 2 };
		case "quarterBL":      return { x, y: y + h / 2, w: w / 2, h: h / 2 };
		case "quarterBR":      return { x: x + w / 2, y: y + h / 2, w: w / 2, h: h / 2 };
		case "thirdL":         return { x, y, w: w / 3, h };
		case "thirdC":         return { x: x + w / 3, y, w: w / 3, h };
		case "thirdR":         return { x: x + (2 * w) / 3, y, w: w / 3, h };
		case "twoThirdsL":     return { x, y, w: (2 * w) / 3, h };
		case "twoThirdsR":     return { x: x + w / 3, y, w: (2 * w) / 3, h };
		case "sixthTL":        return { x,                   y,            w: w / 3, h: h / 2 };
		case "sixthTC":        return { x: x + w / 3,        y,            w: w / 3, h: h / 2 };
		case "sixthTR":        return { x: x + (2 * w) / 3,  y,            w: w / 3, h: h / 2 };
		case "sixthBL":        return { x,                   y: y + h / 2, w: w / 3, h: h / 2 };
		case "sixthBC":        return { x: x + w / 3,        y: y + h / 2, w: w / 3, h: h / 2 };
		case "sixthBR":        return { x: x + (2 * w) / 3,  y: y + h / 2, w: w / 3, h: h / 2 };
		case "maximize":       return { x, y, w, h };
		case "almostMaximize": return { x: x + w * 0.06, y: y + h * 0.06, w: w * 0.88, h: h * 0.88 };
		case "center":         return { x: x + w * 0.18, y: y + h * 0.18, w: w * 0.64, h: h * 0.64 };
		case "centerHalf":     return { x: x + w * 0.25, y: y + h * 0.29, w: w * 0.5, h: h * 0.42 };
		default:               return null;
	}
}

function svgWrap(size, body, { transparent = false } = {}) {
	const bg = transparent ? "" : `<rect width="${size}" height="${size}" fill="${COLOR_BG}"/>`;
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${bg}${body}</svg>`;
}

function frameForSize(size) {
	const inset = (FRAME_INSET / 144) * size;
	return { x: inset, y: inset, w: size - inset * 2, h: size - inset * 2 };
}

function drawLayoutBody(layout, size, { mono = false } = {}) {
	const f = frameForSize(size);
	const stroke = mono ? COLOR_FG_MONO : COLOR_FRAME;
	const fill = mono ? COLOR_FG_MONO : COLOR_FILL;
	const fillMuted = mono ? COLOR_FG_MONO : COLOR_FILL_MUTED;
	const strokeW = Math.max(1, size / 72);
	const radius = Math.max(2, size / 24);

	const frameRect = `<rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" fill="none" stroke="${stroke}" stroke-width="${strokeW}" rx="${radius}" ry="${radius}"/>`;

	const fillR = fillRectForLayout(layout, f);
	if (fillR) {
		const fillOpacity = mono ? "0.85" : "1";
		const fillRect = `<rect x="${fillR.x}" y="${fillR.y}" width="${fillR.w}" height="${fillR.h}" fill="${fill}" fill-opacity="${fillOpacity}" rx="${radius * 0.6}" ry="${radius * 0.6}"/>`;
		return fillRect + frameRect;
	}

	if (layout === "restore") {
		const cx = f.x + f.w / 2;
		const cy = f.y + f.h / 2;
		const r = f.w * 0.28;
		const arrow = `<path d="M ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx} ${cy - r}" fill="none" stroke="${fill}" stroke-width="${strokeW * 2.2}" stroke-linecap="round"/>` +
			`<path d="M ${cx} ${cy - r - r * 0.35} L ${cx} ${cy - r} L ${cx + r * 0.4} ${cy - r * 0.65} Z" fill="${fill}"/>`;
		return frameRect + arrow;
	}

	if (layout === "larger" || layout === "smaller") {
		const innerScale = layout === "larger" ? 0.45 : 0.7;
		const outerScale = layout === "larger" ? 0.85 : 0.5;
		const inner = {
			x: f.x + (f.w * (1 - innerScale)) / 2,
			y: f.y + (f.h * (1 - innerScale)) / 2,
			w: f.w * innerScale,
			h: f.h * innerScale,
		};
		const outer = {
			x: f.x + (f.w * (1 - outerScale)) / 2,
			y: f.y + (f.h * (1 - outerScale)) / 2,
			w: f.w * outerScale,
			h: f.h * outerScale,
		};
		const innerRect = `<rect x="${inner.x}" y="${inner.y}" width="${inner.w}" height="${inner.h}" fill="${fillMuted}" stroke="${fill}" stroke-width="${strokeW}" rx="${radius * 0.5}" ry="${radius * 0.5}"/>`;
		const outerRect = `<rect x="${outer.x}" y="${outer.y}" width="${outer.w}" height="${outer.h}" fill="none" stroke="${fill}" stroke-width="${strokeW * 1.4}" stroke-dasharray="${strokeW * 2.5} ${strokeW * 2}" rx="${radius * 0.5}" ry="${radius * 0.5}"/>`;
		return frameRect + outerRect + innerRect;
	}

	if (layout === "displayNext" || layout === "displayPrev") {
		const gap = f.w * 0.06;
		const monW = (f.w - gap) / 2;
		const monH = f.h * 0.7;
		const monY = f.y + (f.h - monH) / 2;
		const left =  { x: f.x, y: monY, w: monW, h: monH };
		const right = { x: f.x + monW + gap, y: monY, w: monW, h: monH };
		const targetIsRight = layout === "displayNext";
		const target = targetIsRight ? right : left;
		const idle = targetIsRight ? left : right;
		const idleRect = `<rect x="${idle.x}" y="${idle.y}" width="${idle.w}" height="${idle.h}" fill="none" stroke="${stroke}" stroke-width="${strokeW}" rx="${radius * 0.5}" ry="${radius * 0.5}"/>`;
		const targetRect = `<rect x="${target.x}" y="${target.y}" width="${target.w}" height="${target.h}" fill="${fill}" rx="${radius * 0.5}" ry="${radius * 0.5}"/>`;
		const arrowY = f.y + f.h / 2;
		const arrowSize = strokeW * 5;
		const arrowX = f.x + monW + gap / 2;
		const arrowPath = targetIsRight
			? `M ${arrowX - arrowSize / 2} ${arrowY - arrowSize / 2} L ${arrowX + arrowSize / 2} ${arrowY} L ${arrowX - arrowSize / 2} ${arrowY + arrowSize / 2} Z`
			: `M ${arrowX + arrowSize / 2} ${arrowY - arrowSize / 2} L ${arrowX - arrowSize / 2} ${arrowY} L ${arrowX + arrowSize / 2} ${arrowY + arrowSize / 2} Z`;
		const arrow = `<path d="${arrowPath}" fill="${fill}"/>`;
		return idleRect + targetRect + arrow;
	}

	return frameRect;
}

function renderPng(svg, outPath) {
	const tmpSvg = `${outPath}.svg`;
	writeFileSync(tmpSvg, svg);
	execFileSync("sips", ["-s", "format", "png", tmpSvg, "--out", outPath], { stdio: "pipe" });
	unlinkSync(tmpSvg);
}

function ensureDir(p) {
	mkdirSync(p, { recursive: true });
}

for (const { name, layout } of ACTIONS) {
	const dir = path.join(OUT_ACTIONS, name);
	ensureDir(dir);

	renderPng(svgWrap(20, drawLayoutBody(layout, 20, { mono: true }), { transparent: true }), path.join(dir, "icon.png"));
	renderPng(svgWrap(40, drawLayoutBody(layout, 40, { mono: true }), { transparent: true }), path.join(dir, "icon@2x.png"));
	renderPng(svgWrap(72, drawLayoutBody(layout, 72)), path.join(dir, "key.png"));
	renderPng(svgWrap(144, drawLayoutBody(layout, 144)), path.join(dir, "key@2x.png"));

	console.log(`wrote ${name} icons`);
}

const brandLayout = "maximize";
renderPng(svgWrap(28, drawLayoutBody(brandLayout, 28, { mono: true }), { transparent: true }), path.join(OUT_PLUGIN, "category-icon.png"));
renderPng(svgWrap(56, drawLayoutBody(brandLayout, 56, { mono: true }), { transparent: true }), path.join(OUT_PLUGIN, "category-icon@2x.png"));
renderPng(svgWrap(144, drawLayoutBody(brandLayout, 144)), path.join(OUT_PLUGIN, "marketplace.png"));
renderPng(svgWrap(288, drawLayoutBody(brandLayout, 288)), path.join(OUT_PLUGIN, "marketplace@2x.png"));

console.log("wrote plugin-level icons");
