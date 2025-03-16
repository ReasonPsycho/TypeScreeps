export default function PlanTowers(roomName: string): void {
  const bestSpawnPosition = Memory.rooms[roomName].bestSpawnPosition;

  const map: number[] = Array<number>(Memory.rooms[roomName].possibleStructurePositions.length).fill(0);
  let maxIndex = -1;
  let lastTowerX = 0;
  let lastTowerY = 0;
  for (let i = 0; i < 6; i++) {
    let maxValue = -1;
    Memory.rooms[roomName].possibleStructurePositions.forEach((pos, index: number) => {
      if (lastTowerX === 0 && lastTowerY === 0) {
        map[index] += Math.abs(pos.x - bestSpawnPosition.x) + Math.abs(pos.y - bestSpawnPosition.y);
        if (map[index] > maxValue) {
          maxValue = map[index];
          maxIndex = index;
        }
      } else {
        map[index] += Math.abs(pos.x - lastTowerX) + Math.abs(pos.y - lastTowerY);
        if (map[index] > maxValue) {
          maxValue = map[index];
          maxIndex = index;
        }
      }
    });

    lastTowerX = Memory.rooms[roomName].possibleStructurePositions[maxIndex].x;
    lastTowerY = Memory.rooms[roomName].possibleStructurePositions[maxIndex].y;

    Memory.rooms[roomName].plannedBuildings.push({
      structureType: STRUCTURE_TOWER,
      pos: { x: lastTowerX, y: lastTowerY }
    });

    Memory.rooms[roomName].possibleStructurePositions.splice(maxIndex, 1);
  }
}
