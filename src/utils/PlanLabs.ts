export default function PlanLabs(roomName: string): void {
  const roomMemory = Memory.rooms[roomName];
  const possiblePositions: RoomPosition[] = roomMemory?.possibleStructurePositions || [];
  const labs: RoomPosition[] = []; // Stores the final list of lab positions

  if (!roomMemory || possiblePositions.length === 0) {
    console.log(`No possible positions available for room: ${roomName}`);
    return;
  }

  // Filter positions close to the controller for clustering
  const controllerPos = roomMemory.bestControllerPosition;
  const filteredPositions = possiblePositions.filter(
    pos => Math.abs(pos.x - controllerPos.x) < 5 && Math.abs(pos.y - controllerPos.y) < 5
  );

  // Find starting 2 labs (initial seed cluster)
  let foundStart = false;
  for (let i = 0; i < filteredPositions.length; i++) {
    for (let j = i + 1; j < filteredPositions.length; j++) {
      if (
        Math.abs(filteredPositions[i].x - filteredPositions[j].x) <= 2 &&
        Math.abs(filteredPositions[i].y - filteredPositions[j].y) <= 2
      ) {
        labs.push(filteredPositions[i], filteredPositions[j]);
        foundStart = true;
        break;
      }
    }
    if (foundStart) break;
  }

  if (labs.length < 2) {
    console.log(`Unable to find initial cluster for labs in room: ${roomName}`);
    return;
  }

  // Expand the cluster to 10 labs
  while (labs.length < 10) {
    // Get available positions NOT already in labs
    const availablePositions = filteredPositions.filter(pos => !labs.some(l => l.x === pos.x && l.y === pos.y));
    /* .sort((a, b) => {
        const distanceA = Math.abs(a.x - controllerPos.x) + Math.abs(a.y - controllerPos.y);
        const distanceB = Math.abs(b.x - controllerPos.x) + Math.abs(b.y - controllerPos.y);
        return distanceA - distanceB; // Sort by Manhattan distance to controller
      });*/
    const nextPosition = availablePositions.find(
      pos => labs.filter(lab => Math.abs(lab.x - pos.x) <= 2 && Math.abs(lab.y - pos.y) <= 2).length >= 2
    );

    if (nextPosition) {
      labs.push(nextPosition);
    } else {
      console.log(`Could not find enough suitable lab positions in room: ${roomName}`);
      break;
    }
  }

  // Check if we succeeded in placing all 10 labs
  if (labs.length === 10) {
    labs.forEach(lab => {
      Memory.rooms[roomName].plannedBuildings.push({
        structureType: STRUCTURE_LAB,
        pos: { x: lab.x, y: lab.y }
      });
    });

    Memory.rooms[roomName].possibleStructurePositions = possiblePositions.filter(
      pos => !labs.some(lab => lab.x === pos.x && lab.y === pos.y)
    );
    console.log(`Successfully placed 10 labs in room: ${roomName}`);
  } else {
    console.log(`Failed to place 10 labs in room: ${roomName}. Only found ${labs.length} valid positions.`);
  }
}
