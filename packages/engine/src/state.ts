import { SceneState } from "./types";

export function createInitialState(): SceneState {
    return {
        elements: [],
        viewport: {
            offsetX: 0,
            offsetY: 0,
            zoom: 1,
        },
    };
}

