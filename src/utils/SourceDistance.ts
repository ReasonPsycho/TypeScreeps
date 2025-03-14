import { visualMap } from "./CustomPatfinding";

export default function SourceDistance(roomName: string): number[][] {
  const customGrid = Game.rooms[roomName].getCustomGrid();

  for (let i = 0; i < customGrid.sources.length; i++) {
    customGrid.setUpGrid(
      tile => customGrid.sources[i].pos.x === tile.pos.x && customGrid.sources[i].pos.y === tile.pos.y
    );
    customGrid.pushToClosed(tile => tile.terrain === "wall");
    customGrid.execute();
    Memory.rooms[roomName].distanceMaps["SourceDistance" + i.toString()] = customGrid.valueMap;

    customGrid.clear();
  }

  visualMap(customGrid.valueMap, roomName);
  return customGrid.valueMap;
}
