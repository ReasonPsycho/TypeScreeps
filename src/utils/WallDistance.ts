export default function WallDistance(roomName: string): number[][] {
  const customGrid = Game.rooms[roomName].getCustomGrid();
  customGrid.setUpGrid(tile => tile.terrain === "wall");
  customGrid.execute();
  customGrid.visualMap();
  Memory.rooms[roomName].distanceMaps.WallDistance = customGrid.valueMap;
  return customGrid.valueMap;
}
