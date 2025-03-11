import { visualBuildingPlan } from "./CustomPatfinding";

export default function PlanController(roomName: string): void {
  const centralPos = Memory.rooms[roomName].bestControllerPosition;

  // Upper
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_LINK,
    pos: { x: centralPos.x, y: centralPos.y }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x, y: centralPos.y + 1 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x + 1, y: centralPos.y + 1 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x - 1, y: centralPos.y + 1 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x + 1, y: centralPos.y }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x - 1, y: centralPos.y }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x, y: centralPos.y - 1 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x + 1, y: centralPos.y - 1 }
  });
  Memory.rooms[roomName].plannedBuildings.push({
    structureType: STRUCTURE_ROAD,
    pos: { x: centralPos.x - 1, y: centralPos.y - 1 }
  });

  Memory.rooms[roomName].distanceMaps.CenterExitsDistance[centralPos.x][centralPos.y] = 0;
  Memory.rooms[roomName].distanceMaps.CenterExitsDistance[centralPos.x + -1][centralPos.y] = 0;
  Memory.rooms[roomName].distanceMaps.CenterExitsDistance[centralPos.x + +1][centralPos.y] = 0;
  Memory.rooms[roomName].distanceMaps.CenterExitsDistance[centralPos.x][centralPos.y + 1] = 0;
  Memory.rooms[roomName].distanceMaps.CenterExitsDistance[centralPos.x + -1][centralPos.y + 1] = 0;
  Memory.rooms[roomName].distanceMaps.CenterExitsDistance[centralPos.x + +1][centralPos.y + 1] = 0;
  Memory.rooms[roomName].distanceMaps.CenterExitsDistance[centralPos.x][centralPos.y - 1] = 0;
  Memory.rooms[roomName].distanceMaps.CenterExitsDistance[centralPos.x + -1][centralPos.y - 1] = 0;
  Memory.rooms[roomName].distanceMaps.CenterExitsDistance[centralPos.x + +1][centralPos.y - 1] = 0;

  visualBuildingPlan(roomName);
}
