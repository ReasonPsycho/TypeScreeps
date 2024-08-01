import { visualBuildingPlan } from "./CustomPatfinding";

export default function PlanCenter(roomName: string): void {
  const centralPos = Memory.rooms[roomName].bestSpawnPosition;

  // Upper
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_SPAWN,
    pos: { x: centralPos.x, y: centralPos.y + 1 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_SPAWN,
    pos: { x: centralPos.x + 1, y: centralPos.y + 1 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_SPAWN,
    pos: { x: centralPos.x - 1, y: centralPos.y + 1 }
  });
  // Middle
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_TERMINAL,
    pos: { x: centralPos.x - 1, y: centralPos.y }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_LINK,
    pos: { x: centralPos.x + 1, y: centralPos.y }
  });
  // Lower
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_STORAGE,
    pos: { x: centralPos.x - 1, y: centralPos.y - 1 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_SPAWN,
    pos: { x: centralPos.x + 1, y: centralPos.y - 1 }
  });
  // Roads
  Memory.rooms[roomName].plannedBuildings.push({ structureType: STRUCTURE_ROAD, pos: centralPos });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x, y: centralPos.y - 1 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x - 1, y: centralPos.y - 2 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x + 1, y: centralPos.y - 2 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x - 2, y: centralPos.y - 1 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x + 2, y: centralPos.y - 1 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x - 2, y: centralPos.y }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x + 2, y: centralPos.y }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x - 2, y: centralPos.y + 1 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x + 2, y: centralPos.y + 1 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x - 1, y: centralPos.y + 2 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x + 1, y: centralPos.y + 2 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x, y: centralPos.y + 2 }
  });

  visualBuildingPlan(roomName);
}
