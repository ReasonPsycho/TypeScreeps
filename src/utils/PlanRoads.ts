export default function PlanRoads(roomName: string): void {
  const terrain = Game.map.getRoomTerrain(roomName); // Get the room terrain object
  const dxArray = [0, 1, 0, -1];
  const dyArray = [1, 0, -1, 0];

  Memory.rooms[roomName].possibleStructurePositions.forEach(pos => {
    for (let i = 0; i < 4; i++) {
      if (dxArray[i] === 0 && dyArray[i] === 0) continue; // Skip the source's own position

      const x = pos.x + dxArray[i];
      const y = pos.y + dyArray[i];

      if (
        Memory.rooms[roomName].possibleStructurePositions.some(
          structurePos => structurePos.x === x && structurePos.y === y
        )
      )
        continue; // Skip if the position matches exactly

      if (
        Memory.rooms[roomName].plannedBuildings.some(
          plannedBuilding => plannedBuilding.pos.x === x && plannedBuilding.pos.y === y
        )
      )
        continue; // Skip if it's already planned

      if (terrain.get(x, y) === TERRAIN_MASK_WALL) continue; // Skip if there is a wall there

      Memory.rooms[roomName].plannedBuildings.push({
        structureType: STRUCTURE_ROAD,
        pos: { x, y }
      });
    }
  });
  const sources = Game.rooms[roomName].find(FIND_SOURCES);

  sources.forEach(source => {
    let hasFinished = false;
    const path = source.pos.findPathTo(
      Memory.rooms[roomName].bestSpawnPosition.x,
      Memory.rooms[roomName].bestSpawnPosition.y,
      {
        ignoreCreeps: true
      }
    );

    path.forEach((pos, index) => {
      if (index <= 2 || hasFinished) {
        return;
      }

      if (
        Memory.rooms[roomName].possibleStructurePositions.some(
          structurePos => structurePos.x === pos.x && structurePos.y === pos.y
        ) ||
        Memory.rooms[roomName].plannedBuildings.some(
          plannedBuilding => plannedBuilding.pos.x === pos.x && plannedBuilding.pos.y === pos.y
        ) // Un-optimal ass shit but works
      ) {
        if (!Memory.rooms[roomName].plannedBuildings.some(building => building.structureType === STRUCTURE_RAMPART)) {
          Memory.rooms[roomName].plannedBuildings.push({
            structureType: STRUCTURE_RAMPART,
            pos: { x: path[index - 1].x, y: path[index - 1].y }
          });
        }
        hasFinished = true;
        return; // Skip the source's own position
      }

      Memory.rooms[roomName].plannedBuildings.push({
        structureType: STRUCTURE_ROAD,
        pos: { x: pos.x, y: pos.y }
      });
    });
  });

  const minerals = Game.rooms[roomName].find(FIND_MINERALS);

  minerals.forEach(mineral => {
    let hasFinished = false;
    const path = mineral.pos.findPathTo(
      Memory.rooms[roomName].bestSpawnPosition.x,
      Memory.rooms[roomName].bestSpawnPosition.y,
      {
        ignoreCreeps: true,
        costCallback(callbackRoomName, costMatrix) {
          // Add planned buildings to the cost matrix
          const roomMemory = Memory.rooms[callbackRoomName];
          if (roomMemory && roomMemory.plannedBuildings) {
            roomMemory.plannedBuildings.forEach(building => {
              if (building.structureType === STRUCTURE_WALL) {
                costMatrix.set(building.pos.x, building.pos.y, 255);
              }
            });
          }
          return costMatrix;
        }
      }
    );

    path.forEach((pos, index) => {
      if (index === 0 || hasFinished) {
        return;
      }

      if (
        Memory.rooms[roomName].possibleStructurePositions.some(
          structurePos => structurePos.x === pos.x && structurePos.y === pos.y
        ) ||
        Memory.rooms[roomName].plannedBuildings.some(
          plannedBuilding => plannedBuilding.pos.x === pos.x && plannedBuilding.pos.y === pos.y
        ) // Un-optimal ass shit but works
      ) {
        Memory.rooms[roomName].plannedBuildings.push({
          structureType: STRUCTURE_RAMPART,
          pos: { x: path[index - 1].x, y: path[index - 1].y }
        });
        hasFinished = true;
        return; // Skip the source's own position
      }

      Memory.rooms[roomName].plannedBuildings.push({
        structureType: STRUCTURE_ROAD,
        pos: { x: pos.x, y: pos.y }
      });
    });
  });
}
