import { visualBuildingPlan, visualMap } from "./CustomPatfinding";

export default function PlanBuildings(roomName: string): void {
  const centralPos = Memory.rooms[roomName].bestSpawnPosition;
  if (!centralPos || centralPos.x === undefined || centralPos.y === undefined) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const map: number[][] = Array(50)
    .fill(0)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .map(() => Array(50).fill(0));

  // Center the pattern around `centralPos`
  for (let x = 0; x < 50; x++) {
    for (let y = 0; y < 50; y++) {
      // Calculate offsets, adjusting for meshing
      const offsetX = Math.abs(x - centralPos.x) % 4;
      const offsetY = Math.abs(y - centralPos.y) % 4;

      // Alternate rows to create an offset pattern (meshing effect)
      const isOffsetRow = Math.floor((x - centralPos.x) / 4) % 2 === 1;

      // Apply meshing offset logic:
      const adjustedY = isOffsetRow ? (offsetY + 2) % 4 : offsetY;

      // Create the diamond pattern with the adjusted offset
      if (Math.abs(offsetX - 2) + Math.abs(adjustedY - 2) <= 2) {
        map[x][y] = 0; // Open space
      } else {
        map[x][y] = 1; // Filled space
      }
    }
  }

  visualMap(map, roomName);
}
