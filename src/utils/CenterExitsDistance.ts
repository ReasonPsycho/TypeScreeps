import { visualMap } from "./CustomPatfinding";

export default function CenterExitsDistance(roomName: string): number[][] {
  const customGrid = Game.rooms[roomName].getCustomGrid();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const map: number[][] = Array(50)
    .fill(0)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .map(() => Array(50).fill(0));

  customGrid.setUpGrid(tile =>
    Memory.rooms[roomName].plannedBuildings.some(
      planedBuilding => planedBuilding.pos.x === tile.pos.x && planedBuilding.pos.y === tile.pos.y
    )
  );
  customGrid.pushToClosed(tile => tile.terrain === "wall");
  customGrid.execute();

  for (let x = 0; x < 50; x++) {
    for (let y = 0; y < 50; y++) {
      let isOutsideSources = true;
      let isOutsideMinerals = true;
      customGrid.sources.forEach((source, index) => {
        if (Memory.rooms[roomName].distanceMaps["SourceDistance" + index.toString()][x][y] <= 1) {
          isOutsideSources = false;
        }
      });
      customGrid.minerals.forEach((source, index) => {
        if (Memory.rooms[roomName].distanceMaps["MineralDistance" + index.toString()][x][y] <= 1) {
          isOutsideMinerals = false;
        }
      });

      if (customGrid.valueMap[x][y] > 0 && isOutsideSources && isOutsideMinerals) {
        map[x][y] =
          (customGrid.valueMap[x][y] * 10 - Memory.rooms[roomName].distanceMaps.ExitDistance[x][y] * 0.1) / 10;
      } else {
        map[x][y] = 0;
      }
    }
  }

  Memory.rooms[roomName].distanceMaps.CenterExitsDistance = map;
  visualMap(map, roomName);
  return customGrid.valueMap;
}
