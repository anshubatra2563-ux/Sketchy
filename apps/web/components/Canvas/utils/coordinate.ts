export function getWorldCoordinates(
  ClientX: number,
  ClientY: number,
  rect: DOMRect,
  viewport: { offsetX: number; offsetY: number; zoom: number },
) {
  const x = ClientX - rect.left;
  const y = ClientY - rect.top;
  const { offsetX, offsetY, zoom } = viewport;

  return {
    x: x / zoom + offsetX,
    y: y / zoom + offsetY,
  };
}
