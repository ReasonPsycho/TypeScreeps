import { lerpColor } from "./Visual";

export default function ExitDistance(roomName: string): number[][] {
  const customGrid = Game.rooms[roomName].getCustomGrid();
  customGrid.setUpGrid(tile => tile.exit);
  customGrid.pushToClosed(tile => tile.terrain === "wall");
  customGrid.execute();
  customGrid.visualMap();
  Memory.rooms[roomName].distanceMaps.ExitDistance = customGrid.valueMap;
  return customGrid.valueMap;
}
