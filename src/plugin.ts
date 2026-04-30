import streamDeck from "@elgato/streamdeck";

import { createRectangleAction } from "./action.js";
import { RECTANGLE_ACTIONS } from "./config.js";

streamDeck.logger.setLevel("info");

for (const def of RECTANGLE_ACTIONS) {
	streamDeck.actions.registerAction(createRectangleAction(def.uuid, def.name, def.layout));
}

streamDeck.connect();
