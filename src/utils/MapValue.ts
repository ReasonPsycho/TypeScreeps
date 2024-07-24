export default function MapValue(roomName: string): RoomPosition[] {
  const intrestPoints: RoomPosition[] = [];
  const potentialSpawnPos: RoomPosition[] = [];

  // Initialize distanceGrid for the wall positions.
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
      if (
        Game.rooms[roomName]
          .lookAt(x, y)
          .some(
            structure =>
              structure.type === LOOK_ENERGY ||
              (structure.type === LOOK_STRUCTURES && structure.structure.structureType === STRUCTURE_CONTROLLER)
          )
      ) {
        intrestPoints.push(new RoomPosition(x, y, roomName));
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (Memory.rooms[roomName].distanceMap[x][y] >= 5) {
        console.log(x, y, roomName);
        potentialSpawnPos.push(new RoomPosition(x, y, roomName));
      }
    }
  }

  const pathLengths: number[] = Array(potentialSpawnPos.length).fill(0) as number[];

  potentialSpawnPos.forEach((spawnPos, index) => {
    intrestPoints.forEach(intrestPoint => {
      pathLengths[index] += PathFinder.search(spawnPos, intrestPoint).path.length;
    });
  });

  console.log(JSON.stringify(potentialSpawnPos));
  potentialSpawnPos.forEach((spawnPos, index) => {
    Game.rooms[roomName].visual.text(pathLengths[index].toString(), spawnPos.x, spawnPos.y, {
      color: "#ffffff"
    });
  });

  return potentialSpawnPos;
}
