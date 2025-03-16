export default function ControllerDistance(roomName: string): number[][] {
  const customGrid = Game.rooms[roomName].getCustomGrid();
  customGrid.setUpGrid(tile => tile.structures.some(structure => structure.structureType === STRUCTURE_CONTROLLER));
  customGrid.pushToClosed(tile => tile.terrain === "wall");
  customGrid.execute();
  customGrid.visualMap();
  Memory.rooms[roomName].distanceMaps.ControllerDistance = customGrid.valueMap;
  return customGrid.valueMap;
}
