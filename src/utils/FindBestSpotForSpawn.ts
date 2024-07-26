import { visualMap } from "./CustomPatfinding";

export default function FindBestSpotForSpawn(roomName: string): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const map: number[][] = Array(50)
    .fill(0)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .map(() => Array(50).fill(0));

  let maxValue = 0;
  let maxValueIndex = [0, 0];
  for (let x = 0; x < 50; x++) {
    for (let y = 0; y < 50; y++) {
      if (Memory.rooms[roomName].distanceMaps.WallDistance[x][y] >= 3) {
        map[x][y] += Memory.rooms[roomName].distanceMaps.ExitDistance[x][y];
        map[x][y] -= Memory.rooms[roomName].distanceMaps.ControllerDistance[x][y] * 0.5;
        map[x][y] -= Memory.rooms[roomName].distanceMaps.SourceDistance[x][y];
        if (map[x][y] > maxValue) {
          maxValue = map[x][y];
          maxValueIndex = [x, y];
        }
      } else {
        map[x][y] = 0;
      }
    }
  }

  Memory.rooms[roomName].bestSpawnPosition = new RoomPosition(maxValueIndex[0], maxValueIndex[1], roomName);
  visualMap(map, roomName);
}
