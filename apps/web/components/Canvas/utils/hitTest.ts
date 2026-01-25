import { Element } from "@repo/engine"
export function hitTest(px: number, py: number, element: Element , zoom: number) {
      if (element.type == "rectangle") {
        return (
          px >= element.x &&
          px <= element.x + element.width &&
          py >= element.y &&
          py <= element.y + element.height
        );
      }
      if (element.type == "ellipse") {
        const radiusX = element.width / 2;
        const radiusY = element.height / 2;
        const centerX = element.x + radiusX;
        const centerY = element.y + radiusY;
        const dx = px - centerX;
        const dy = py - centerY;
        return (
          (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) <= 1
        );
      }
      if (element.type == "diamond-box") {
        const centerX = element.x + element.width / 2;
        const centerY = element.y + element.height / 2;
        // dx and dy are the distances from the center to the point
        // later these are ised to check how much they have consumed the diamond radius
        const dx = Math.abs(px - centerX);
        const dy = Math.abs(py - centerY);

        return dx / (element.width / 2) + dy / (element.height / 2) <= 1;
      }
      if (element.type === "line") {
        const x1 = element.x;
        const y1 = element.y;
        const x2 = element.x + element.width;
        const y2 = element.y + element.height;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const lengthSq = dx * dx + dy * dy;
        if (lengthSq === 0) return false;

        const t = ((px - x1) * dx + (py - y1) * dy) / lengthSq;
        if (t < 0 || t > 1) return false;

        const projX = x1 + t * dx;
        const projY = y1 + t * dy;

        const distSq =
          (px - projX) * (px - projX) + (py - projY) * (py - projY);

        const tolerance = 6 / zoom;
        return distSq <= tolerance * tolerance;
      }

      return false;
    }