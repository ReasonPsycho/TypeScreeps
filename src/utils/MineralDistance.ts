import { visualMap } from "./CustomPatfinding";

export default function MineralDistance(roomName: string): number[][] {
  const customGrid = Game.rooms[roomName].getCustomGrid();

  for (let i = 0; i < customGrid.minerals.length; i++) {
    customGrid.setUpGrid(
      tile => customGrid.minerals[i].pos.x === tile.pos.x && customGrid.minerals[i].pos.y === tile.pos.y
    );
    customGrid.pushToClosed(tile => tile.terrain === "wall");
    customGrid.execute();
    Memory.rooms[roomName].distanceMaps["MineralDistance" + i.toString()] = customGrid.valueMap;

    customGrid.clear();
  }

  visualMap(customGrid.valueMap, roomName);
  return customGrid.valueMap;
}
