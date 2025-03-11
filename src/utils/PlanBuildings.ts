import { visualBuildingPlan } from "./CustomPatfinding";

export default function PlanBuildings(roomName: string): void {
  const centralPos = Memory.rooms[roomName].bestSpawnPosition;
  console.log(centralPos);
  Game.rooms[roomName].visual.circle(centralPos.x, centralPos.y, { radius: 0.55, stroke: "red" });
  const offsetX = centralPos.x % 4;
  const offsetY = centralPos.y % 4;
  for (let x = -2; x < 14; x++) {
    for (let y = -2; y < 14; y++) {
      const points: RoomPosition[] = [];
      if (
        x * 4 - 2 + offsetX >= 0 &&
        y * 4 - 2 + offsetY >= 0 &&
        x * 4 + 2 + offsetX < 50 &&
        y * 4 + 2 + offsetY < 50
      ) {
        points.push(new RoomPosition(x * 4 + offsetX, y * 4 + 2 + offsetY, roomName)); // top
        points.push(new RoomPosition(x * 4 - 2 + offsetX, y * 4 + offsetY, roomName)); // left
        points.push(new RoomPosition(x * 4 + offsetX, y * 4 - 2 + offsetY, roomName)); // bottom
        points.push(new RoomPosition(x * 4 + 2 + offsetX, y * 4 + offsetY, roomName)); // right
        points.push(new RoomPosition(x * 4 + offsetX, y * 4 + 2 + offsetY, roomName)); // top
      }
      Game.rooms[roomName].visual.poly(points);
    }
  }
}
