import { visualMap } from "./CustomPatfinding";

export default function SourceDistance(roomName: string): number[][] {
  const customGrid = Game.rooms[roomName].getCustomGrid();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const map: number[][] = Array(50)
    .fill(0)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .map(() => Array(50).fill(0));

  for (const source of customGrid.sources) {
    customGrid.setUpGrid(tile => source.pos.x === tile.pos.x && source.pos.y === tile.pos.y);
    customGrid.pushToClosed(tile => tile.terrain === "wall");
    customGrid.execute();

    for (let x = 0; x < 50; x++) {
      for (let y = 0; y < 50; y++) {
        map[x][y] += customGrid.valueMap[x][y];
      }
    }
    customGrid.clear();
  }

  visualMap(map, roomName);
  Memory.rooms[roomName].distanceMaps.SourceDistance = customGrid.valueMap;
  return map;
}
