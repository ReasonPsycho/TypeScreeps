import { PathFindingTile, visualMap } from "./CustomPatfinding";

export default function FindBestSpotForController(roomName: string): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const map: number[][] = Array(50)
    .fill(0)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .map(() => Array(50).fill(0));

  let minValue = 1000;
  let minValueIndex = [0, 0];
  for (let x = 0; x < 50; x++) {
    for (let y = 0; y < 50; y++) {
      if (
        Memory.rooms[roomName].distanceMaps.ControllerDistance[x][y] === 2 &&
        Memory.rooms[roomName].distanceMaps.WallDistance[x][y] > 1 &&
        Memory.rooms[roomName].distanceMaps.WallDistance[x][y] <= 4
      ) {
        map[x][y] = Memory.rooms[roomName].distanceMaps.CenterExitsDistance[x][y];
        if (map[x][y] < minValue) {
          minValue = map[x][y];
          minValueIndex = [x, y];
        }
      } else {
        map[x][y] = 0;
      }
    }
  }

  Memory.rooms[roomName].distanceMaps.CenterExitsDistance[minValueIndex[0]][minValueIndex[1]] = 0;
  Memory.rooms[roomName].bestControllerPosition = new RoomPosition(minValueIndex[0], minValueIndex[1], roomName);
  visualMap(map, roomName);
}
