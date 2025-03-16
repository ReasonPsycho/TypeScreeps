import { forEach } from "lodash";

export default function PlanRest(roomName: string): void {
  const bestSpawnPosition = Memory.rooms[roomName].bestSpawnPosition;
  const buildings = [STRUCTURE_FACTORY, STRUCTURE_NUKER, STRUCTURE_OBSERVER];

  const map: number[] = Array<number>(Memory.rooms[roomName].possibleStructurePositions.length).fill(0);
  let minIndex = -1;
  for (let i = 0; i < 3; i++) {
    let minValue = 100000;
    Memory.rooms[roomName].possibleStructurePositions.forEach((pos, index: number) => {
      map[index] += Math.abs(pos.x - bestSpawnPosition.x) + Math.abs(pos.y - bestSpawnPosition.y);
      if (map[index] < minValue) {
        minValue = map[index];
        minIndex = index;
      }
    });

    const buildingX = Memory.rooms[roomName].possibleStructurePositions[minIndex].x;
    const buildingY = Memory.rooms[roomName].possibleStructurePositions[minIndex].y;

    Memory.rooms[roomName].plannedBuildings.push({
      structureType: buildings[i],
      pos: { x: buildingX, y: buildingY }
    });

    Memory.rooms[roomName].possibleStructurePositions.splice(minIndex, 1);
  }

  Memory.rooms[roomName].possibleStructurePositions.forEach(pos => {
    Memory.rooms[roomName].plannedBuildings.push({
      structureType: STRUCTURE_EXTENSION,
      pos: { x: pos.x, y: pos.y }
    });
  });

  Memory.rooms[roomName].possibleStructurePositions = [];
}
