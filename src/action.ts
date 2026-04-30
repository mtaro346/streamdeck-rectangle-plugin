import {
	action,
	type DidReceiveSettingsEvent,
	type KeyDownEvent,
	type KeyUpEvent,
	SingletonAction,
	streamDeck,
	type WillAppearEvent,
} from "@elgato/streamdeck";

import {
	clampBadgePct,
	clampLongPressMs,
	DEFAULT_BADGE_X,
	DEFAULT_BADGE_Y,
	type RectangleActionSettings,
	type RectangleLayout,
	resolveLongPressLayout,
} from "./config.js";
import { renderActionIconSvg, svgToDataUri } from "./icon.js";
import { openRectangleAction } from "./url-opener.js";

export function createRectangleAction(
	uuid: string,
	rectangleActionName: string,
	primaryLayout: RectangleLayout,
): SingletonAction {
	@action({ UUID: uuid })
	class GeneratedRectangleAction extends SingletonAction<RectangleActionSettings> {
		private pressState = new Map<string, AbortController>();

		override async onWillAppear(ev: WillAppearEvent<RectangleActionSettings>): Promise<void> {
			await this.refreshIcon(ev.action, ev.payload.settings);
		}

		override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<RectangleActionSettings>): Promise<void> {
			await this.refreshIcon(ev.action, ev.payload.settings);
		}

		override async onKeyDown(ev: KeyDownEvent<RectangleActionSettings>): Promise<void> {
			const longPressName = ev.payload.settings.longPressAction;
			const longPressLayout = resolveLongPressLayout(longPressName);
			if (!longPressLayout || !longPressName) {
				await this.runAction(rectangleActionName);
				return;
			}

			const longPressMs = clampLongPressMs(ev.payload.settings.longPressMs);

			const timeoutId = setTimeout(() => {
				this.pressState.delete(ev.action.id);
				void this.runAction(longPressName);
			}, longPressMs);

			const controller = new AbortController();
			controller.signal.addEventListener(
				"abort",
				() => {
					this.pressState.delete(ev.action.id);
					clearTimeout(timeoutId);
				},
				{ once: true },
			);

			this.pressState.set(ev.action.id, controller);
		}

		override async onKeyUp(ev: KeyUpEvent<RectangleActionSettings>): Promise<void> {
			const controller = this.pressState.get(ev.action.id);
			if (!controller) {
				return;
			}

			controller.abort();
			await this.runAction(rectangleActionName);
		}

		private async runAction(name: string): Promise<void> {
			try {
				await openRectangleAction(name);
				streamDeck.logger.info(`rectangle: ${name}`);
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : String(err);
				streamDeck.logger.error(`rectangle ${name} failed: ${message}`);
			}
		}

		private async refreshIcon(
			actionRef: WillAppearEvent<RectangleActionSettings>["action"],
			settings: RectangleActionSettings,
		): Promise<void> {
			const longPressLayout = resolveLongPressLayout(settings.longPressAction);
			if (!longPressLayout) {
				await actionRef.setImage();
				return;
			}
			const xPct = clampBadgePct(settings.badgeX, DEFAULT_BADGE_X);
			const yPct = clampBadgePct(settings.badgeY, DEFAULT_BADGE_Y);
			const svg = renderActionIconSvg(primaryLayout, longPressLayout, { xPct, yPct });
			await actionRef.setImage(svgToDataUri(svg));
		}
	}
	return new GeneratedRectangleAction();
}
