import type { RectangleLayout } from "./config.js";

const COLOR_BG = "#0d0d0d";
const COLOR_FRAME = "#3f3f46";
const COLOR_FILL = "#4f8cff";
const COLOR_FILL_MUTED = "#1e3a8a";
const COLOR_LONG = "#fbbf24";
const COLOR_LONG_MUTED = "#78350f";

const ICON_SIZE = 144;
const FRAME_INSET_RATIO = 14 / 144;

interface Rect {
	x: number;
	y: number;
	w: number;
	h: number;
}

function frameForBox(box: Rect, insetRatio: number): Rect {
	const inset = box.w * insetRatio;
	return { x: box.x + inset, y: box.y + inset, w: box.w - inset * 2, h: box.h - inset * 2 };
}

function fillRectForLayout(layout: RectangleLayout, frame: Rect): Rect | null {
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

interface DrawOpts {
	readonly box: Rect;
	readonly insetRatio: number;
	readonly fill: string;
	readonly fillMuted: string;
	readonly stroke: string;
	readonly strokeW: number;
	readonly radius: number;
}

function drawLayout(layout: RectangleLayout, opts: DrawOpts): string {
	const f = frameForBox(opts.box, opts.insetRatio);
	const { stroke, fill, fillMuted, strokeW, radius } = opts;

	const frameRect = `<rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" fill="none" stroke="${stroke}" stroke-width="${strokeW}" rx="${radius}" ry="${radius}"/>`;

	const fillR = fillRectForLayout(layout, f);
	if (fillR) {
		const fillRect = `<rect x="${fillR.x}" y="${fillR.y}" width="${fillR.w}" height="${fillR.h}" fill="${fill}" rx="${radius * 0.6}" ry="${radius * 0.6}"/>`;
		return fillRect + frameRect;
	}

	if (layout === "restore") {
		const cx = f.x + f.w / 2;
		const cy = f.y + f.h / 2;
		const r = f.w * 0.28;
		const arrow =
			`<path d="M ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx} ${cy - r}" fill="none" stroke="${fill}" stroke-width="${strokeW * 2.2}" stroke-linecap="round"/>` +
			`<path d="M ${cx} ${cy - r - r * 0.35} L ${cx} ${cy - r} L ${cx + r * 0.4} ${cy - r * 0.65} Z" fill="${fill}"/>`;
		return frameRect + arrow;
	}

	if (layout === "larger" || layout === "smaller") {
		const innerScale = layout === "larger" ? 0.45 : 0.7;
		const outerScale = layout === "larger" ? 0.85 : 0.5;
		const inner: Rect = {
			x: f.x + (f.w * (1 - innerScale)) / 2,
			y: f.y + (f.h * (1 - innerScale)) / 2,
			w: f.w * innerScale,
			h: f.h * innerScale,
		};
		const outer: Rect = {
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
		const left:  Rect = { x: f.x,                   y: monY, w: monW, h: monH };
		const right: Rect = { x: f.x + monW + gap,      y: monY, w: monW, h: monH };
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

function drawMainLayout(layout: RectangleLayout): string {
	const size = ICON_SIZE;
	return drawLayout(layout, {
		box: { x: 0, y: 0, w: size, h: size },
		insetRatio: FRAME_INSET_RATIO,
		fill: COLOR_FILL,
		fillMuted: COLOR_FILL_MUTED,
		stroke: COLOR_FRAME,
		strokeW: Math.max(1, size / 72),
		radius: Math.max(2, size / 24),
	});
}

function drawLongPressBadge(layout: RectangleLayout, centerXPct: number, centerYPct: number): string {
	const size = ICON_SIZE;
	const badgeW = size * 0.42;
	const badgeH = size * 0.34;

	const bgPad = size * 0.02;
	const dotsClearance = size * 0.07;
	const halfBoxW = badgeW / 2 + bgPad;
	const halfBoxH = badgeH / 2 + bgPad;

	const minCx = halfBoxW;
	const maxCx = size - halfBoxW;
	const minCy = halfBoxH + dotsClearance;
	const maxCy = size - halfBoxH;

	const rawCx = (centerXPct / 100) * size;
	const rawCy = (centerYPct / 100) * size;
	const cx = Math.min(maxCx, Math.max(minCx, rawCx));
	const cy = Math.min(maxCy, Math.max(minCy, rawCy));

	const badgeX = cx - badgeW / 2;
	const badgeY = cy - badgeH / 2;
	const bg = `<rect x="${badgeX - bgPad}" y="${badgeY - bgPad}" width="${badgeW + bgPad * 2}" height="${badgeH + bgPad * 2}" fill="${COLOR_BG}" fill-opacity="0.9" stroke="${COLOR_LONG}" stroke-width="${size / 144}" rx="${size * 0.04}" ry="${size * 0.04}"/>`;

	const layoutSvg = drawLayout(layout, {
		box: { x: badgeX, y: badgeY, w: badgeW, h: badgeH },
		insetRatio: 0.08,
		fill: COLOR_LONG,
		fillMuted: COLOR_LONG_MUTED,
		stroke: COLOR_LONG,
		strokeW: Math.max(1, size / 200),
		radius: Math.max(1, size / 80),
	});

	const dotR = size * 0.022;
	const dotsY = badgeY - bgPad - size * 0.045;
	const dotsCenterX = badgeX - bgPad + (badgeW + bgPad * 2) / 2;
	const gap = size * 0.045;
	const dots =
		`<circle cx="${dotsCenterX - gap}" cy="${dotsY}" r="${dotR}" fill="${COLOR_LONG}"/>` +
		`<circle cx="${dotsCenterX}" cy="${dotsY}" r="${dotR}" fill="${COLOR_LONG}"/>` +
		`<circle cx="${dotsCenterX + gap}" cy="${dotsY}" r="${dotR}" fill="${COLOR_LONG}"/>`;

	return bg + layoutSvg + dots;
}

export interface BadgePosition {
	readonly xPct: number;
	readonly yPct: number;
}

export function renderActionIconSvg(
	primary: RectangleLayout,
	longPress?: RectangleLayout,
	badgePos?: BadgePosition,
): string {
	const size = ICON_SIZE;
	const bg = `<rect width="${size}" height="${size}" fill="${COLOR_BG}"/>`;
	const main = drawMainLayout(primary);
	const badge = longPress
		? drawLongPressBadge(longPress, badgePos?.xPct ?? 68, badgePos?.yPct ?? 68)
		: "";
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${bg}${main}${badge}</svg>`;
}

export function svgToDataUri(svg: string): string {
	const base64 = Buffer.from(svg, "utf8").toString("base64");
	return `data:image/svg+xml;base64,${base64}`;
}
