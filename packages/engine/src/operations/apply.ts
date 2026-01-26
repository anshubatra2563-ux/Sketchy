import { SceneState } from "../types";
import { Operation } from "./types";


export function applyOperation(scene: SceneState, operation: Operation) : SceneState {
    switch (operation.type) {
        case "create":
            scene.elements.push(operation.element);
            return scene;
        case "move":
            const element = scene.elements.find((el) => el.id === operation.elementId);
            if(!element) return scene;
            element.x += operation.dx;
            element.y += operation.dy;
            return scene;
        default: {
            return scene;
        }
    }
}