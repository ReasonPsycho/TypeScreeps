export default function PlanMines(roomName: string): void {
  const sources = Game.rooms[roomName].find(FIND_SOURCES);
  const terrain = Game.map.getRoomTerrain(roomName); // Get the room terrain object

  sources.forEach(source => {
    const path = source.pos.findPathTo(
      Memory.rooms[roomName].bestSpawnPosition.x,
      Memory.rooms[roomName].bestSpawnPosition.y,
      { ignoreCreeps: true }
    );

    Memory.rooms[roomName].sourceMines.push(new RoomPosition(path[0].x, path[0].y, roomName));

    Memory.rooms[roomName].plannedBuildings.push({
      structureType: STRUCTURE_RAMPART,
      pos: { x: path[1].x, y: path[1].y }
    });

    Memory.rooms[roomName].plannedBuildings.push({
      structureType: STRUCTURE_LINK,
      pos: { x: path[1].x, y: path[1].y }
    });

    Memory.rooms[roomName].plannedBuildings.push({
      structureType: STRUCTURE_ROAD,
      pos: { x: path[1].x, y: path[1].y }
    });

    Memory.rooms[roomName].plannedBuildings.push({
      structureType: STRUCTURE_RAMPART,
      pos: { x: path[0].x, y: path[0].y }
    });

    Memory.rooms[roomName].plannedBuildings.push({
      structureType: STRUCTURE_CONTAINER,
      pos: { x: path[0].x, y: path[0].y }
    });

    Memory.rooms[roomName].plannedBuildings.push({
      structureType: STRUCTURE_ROAD,
      pos: { x: path[0].x, y: path[0].y }
    });

    // Check all tiles surrounding the source's position
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue; // Skip the source's own position
        const x = source.pos.x + dx;
        const y = source.pos.y + dy;

        if (x === path[0].x && y === path[0].y) continue; // Check if the position is not a wall
        if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
          Memory.rooms[roomName].plannedBuildings.push({
            structureType: STRUCTURE_WALL,
            pos: { x, y }
          });
        }
      }
    }
  });

  const minerals = Game.rooms[roomName].find(FIND_MINERALS);

  minerals.forEach(mineral => {
    Memory.rooms[roomName].plannedBuildings.push({
      structureType: STRUCTURE_EXTRACTOR,
      pos: { x: mineral.pos.x, y: mineral.pos.y }
    });

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

    Memory.rooms[roomName].mineralMines.push(new RoomPosition(path[0].x, path[0].y, roomName));

    Memory.rooms[roomName].plannedBuildings.push({
      structureType: STRUCTURE_RAMPART,
      pos: { x: path[0].x, y: path[0].y }
    });

    Memory.rooms[roomName].plannedBuildings.push({
      structureType: STRUCTURE_CONTAINER,
      pos: { x: path[0].x, y: path[0].y }
    });

    Memory.rooms[roomName].plannedBuildings.push({
      structureType: STRUCTURE_ROAD,
      pos: { x: path[0].x, y: path[0].y }
    });

    // Check all tiles surrounding the source's position
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue; // Skip the source's own position
        const x = mineral.pos.x + dx;
        const y = mineral.pos.y + dy;

        if (x === path[0].x && y === path[0].y) continue; // Check if the position is not a wall
        if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
          Memory.rooms[roomName].plannedBuildings.push({
            structureType: STRUCTURE_WALL,
            pos: { x, y }
          });
        }
      }
    }
  });
}
