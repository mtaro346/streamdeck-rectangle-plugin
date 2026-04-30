import { spawn } from "node:child_process";

const RECTANGLE_URL_BASE = "rectangle://execute-action";

export function buildRectangleUrl(actionName: string): string {
	return `${RECTANGLE_URL_BASE}?name=${encodeURIComponent(actionName)}`;
}

export function openRectangleAction(actionName: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const url = buildRectangleUrl(actionName);
		// `-g` keeps the launching app from coming to the foreground; Rectangle
		// processes the URL silently and the user's focused window stays active.
		const proc = spawn("open", ["-g", url], { stdio: "ignore" });
		proc.once("error", reject);
		proc.once("close", (code) => {
			if (code === 0) {
				resolve();
				return;
			}
			reject(new Error(`open exited with code ${code} for ${url}`));
		});
	});
}
