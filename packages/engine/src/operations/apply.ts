import { SceneState } from "../types";
import { Operation } from "./types";

export function applyOperation(scene: SceneState, operation: Operation) {
  switch (operation.type) {
    case "create":
      {
        scene.elements.push(operation.element);
      }
      return;
    case "move":
      {
        const element = scene.elements.find(
          (el) => el.id === operation.elementId,
        );
        if (!element) return;
        element.x += operation.dx;
        element.y += operation.dy;
      }
      return;
    case "resize": {
      const element = scene.elements.find((el) => el.id === operation.elementId);
      if (!element) return;
      element.x = operation.rect.x;
      element.y = operation.rect.y;
      element.width = operation.rect.width;
      element.height = operation.rect.height
    }
    return;
    case "delete": {
      const index = scene.elements.findIndex(el => el.id == operation.elementId)
      if (index !== -1) {
        scene.elements.splice(index, 1)
      }
    }
    return;
    default: {
      return;
    }
  }
}
