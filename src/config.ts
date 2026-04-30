export type RectangleLayout =
	| "halfLeft"
	| "halfRight"
	| "halfTop"
	| "halfBottom"
	| "quarterTL"
	| "quarterTR"
	| "quarterBL"
	| "quarterBR"
	| "thirdL"
	| "thirdC"
	| "thirdR"
	| "twoThirdsL"
	| "twoThirdsR"
	| "sixthTL"
	| "sixthTC"
	| "sixthTR"
	| "sixthBL"
	| "sixthBC"
	| "sixthBR"
	| "maximize"
	| "almostMaximize"
	| "center"
	| "centerHalf"
	| "restore"
	| "larger"
	| "smaller"
	| "displayNext"
	| "displayPrev";

export interface RectangleActionDef {
	readonly uuid: string;
	readonly name: string;
	readonly title: string;
	readonly tooltip: string;
	readonly layout: RectangleLayout;
}

export const RECTANGLE_ACTIONS: ReadonlyArray<RectangleActionDef> = [
	{ uuid: "com.asuka.rectangle.left-half",        name: "left-half",        title: "Left Half",         tooltip: "Snap window to the left half of the screen",        layout: "halfLeft"   },
	{ uuid: "com.asuka.rectangle.right-half",       name: "right-half",       title: "Right Half",        tooltip: "Snap window to the right half of the screen",       layout: "halfRight"  },
	{ uuid: "com.asuka.rectangle.top-half",         name: "top-half",         title: "Top Half",          tooltip: "Snap window to the top half of the screen",         layout: "halfTop"    },
	{ uuid: "com.asuka.rectangle.bottom-half",      name: "bottom-half",      title: "Bottom Half",       tooltip: "Snap window to the bottom half of the screen",      layout: "halfBottom" },
	{ uuid: "com.asuka.rectangle.top-left",         name: "top-left",         title: "Top Left",          tooltip: "Snap window to the top-left quarter",               layout: "quarterTL"  },
	{ uuid: "com.asuka.rectangle.top-right",        name: "top-right",        title: "Top Right",         tooltip: "Snap window to the top-right quarter",              layout: "quarterTR"  },
	{ uuid: "com.asuka.rectangle.bottom-left",      name: "bottom-left",      title: "Bottom Left",       tooltip: "Snap window to the bottom-left quarter",            layout: "quarterBL"  },
	{ uuid: "com.asuka.rectangle.bottom-right",     name: "bottom-right",     title: "Bottom Right",      tooltip: "Snap window to the bottom-right quarter",           layout: "quarterBR"  },
	{ uuid: "com.asuka.rectangle.first-third",      name: "first-third",      title: "Left Third",        tooltip: "Snap window to the first (left) third",             layout: "thirdL"     },
	{ uuid: "com.asuka.rectangle.center-third",     name: "center-third",     title: "Center Third",      tooltip: "Snap window to the center third",                   layout: "thirdC"     },
	{ uuid: "com.asuka.rectangle.last-third",       name: "last-third",       title: "Right Third",       tooltip: "Snap window to the last (right) third",             layout: "thirdR"     },
	{ uuid: "com.asuka.rectangle.first-two-thirds", name: "first-two-thirds", title: "Left Two-Thirds",   tooltip: "Snap window to the first two-thirds (left)",        layout: "twoThirdsL" },
	{ uuid: "com.asuka.rectangle.last-two-thirds",  name: "last-two-thirds",  title: "Right Two-Thirds",  tooltip: "Snap window to the last two-thirds (right)",        layout: "twoThirdsR" },
	{ uuid: "com.asuka.rectangle.top-left-sixth",      name: "top-left-sixth",      title: "Top Left Sixth",      tooltip: "Snap window to the top-left sixth (3x2 grid)",      layout: "sixthTL"    },
	{ uuid: "com.asuka.rectangle.top-center-sixth",    name: "top-center-sixth",    title: "Top Center Sixth",    tooltip: "Snap window to the top-center sixth (3x2 grid)",    layout: "sixthTC"    },
	{ uuid: "com.asuka.rectangle.top-right-sixth",     name: "top-right-sixth",     title: "Top Right Sixth",     tooltip: "Snap window to the top-right sixth (3x2 grid)",     layout: "sixthTR"    },
	{ uuid: "com.asuka.rectangle.bottom-left-sixth",   name: "bottom-left-sixth",   title: "Bottom Left Sixth",   tooltip: "Snap window to the bottom-left sixth (3x2 grid)",   layout: "sixthBL"    },
	{ uuid: "com.asuka.rectangle.bottom-center-sixth", name: "bottom-center-sixth", title: "Bottom Center Sixth", tooltip: "Snap window to the bottom-center sixth (3x2 grid)", layout: "sixthBC"    },
	{ uuid: "com.asuka.rectangle.bottom-right-sixth",  name: "bottom-right-sixth",  title: "Bottom Right Sixth",  tooltip: "Snap window to the bottom-right sixth (3x2 grid)",  layout: "sixthBR"    },
	{ uuid: "com.asuka.rectangle.maximize",         name: "maximize",         title: "Maximize",          tooltip: "Maximize window to fill the screen",                layout: "maximize"   },
	{ uuid: "com.asuka.rectangle.almost-maximize",  name: "almost-maximize",  title: "Almost Maximize",   tooltip: "Maximize window with a small margin",               layout: "almostMaximize" },
	{ uuid: "com.asuka.rectangle.center",           name: "center",           title: "Center",            tooltip: "Center window without resizing",                    layout: "center"     },
	{ uuid: "com.asuka.rectangle.center-half",      name: "center-half",      title: "Center Half",       tooltip: "Center window at half size",                        layout: "centerHalf" },
	{ uuid: "com.asuka.rectangle.restore",          name: "restore",          title: "Restore",           tooltip: "Restore window to its previous size and position",  layout: "restore"    },
	{ uuid: "com.asuka.rectangle.larger",           name: "larger",           title: "Larger",            tooltip: "Make window larger",                                layout: "larger"     },
	{ uuid: "com.asuka.rectangle.smaller",          name: "smaller",          title: "Smaller",           tooltip: "Make window smaller",                               layout: "smaller"    },
	{ uuid: "com.asuka.rectangle.next-display",     name: "next-display",     title: "Next Display",      tooltip: "Move window to the next display",                   layout: "displayNext" },
	{ uuid: "com.asuka.rectangle.previous-display", name: "previous-display", title: "Previous Display",  tooltip: "Move window to the previous display",               layout: "displayPrev" },
] as const;

export const LAYOUT_BY_ACTION_NAME: Readonly<Record<string, RectangleLayout>> = Object.freeze(
	RECTANGLE_ACTIONS.reduce<Record<string, RectangleLayout>>((acc, def) => {
		acc[def.name] = def.layout;
		return acc;
	}, {}),
);

export const DEFAULT_LONG_PRESS_MS = 500;
export const MIN_LONG_PRESS_MS = 250;
export const MAX_LONG_PRESS_MS = 1500;

export const DEFAULT_BADGE_X = 68;
export const DEFAULT_BADGE_Y = 68;

export type RectangleActionSettings = {
	longPressAction?: string;
	longPressMs?: number;
	badgeX?: number;
	badgeY?: number;
} & { [key: string]: string | number | boolean | null | undefined };

export function clampLongPressMs(value: unknown): number {
	const n = typeof value === "number" && Number.isFinite(value) ? value : DEFAULT_LONG_PRESS_MS;
	return Math.min(MAX_LONG_PRESS_MS, Math.max(MIN_LONG_PRESS_MS, Math.round(n)));
}

export function clampBadgePct(value: unknown, fallback: number): number {
	const n = typeof value === "number" && Number.isFinite(value) ? value : fallback;
	return Math.min(100, Math.max(0, Math.round(n)));
}

export function resolveLongPressLayout(name: string | undefined): RectangleLayout | undefined {
	if (!name) return undefined;
	return LAYOUT_BY_ACTION_NAME[name];
}
