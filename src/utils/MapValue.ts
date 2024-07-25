import { lerpColor } from "./Visual";

export default function MapValue(roomName: string): RoomPosition[] {
  const intrestPoints: RoomPosition[] = [];
  const potentialSpawnPos: RoomPosition[] = [];
  Game.rooms[roomName].find(FIND_SOURCES).forEach(source => {
    intrestPoints.push(source.pos);
  });
  Game.rooms[roomName]
    .find(FIND_STRUCTURES)
    .filter(structure => structure.structureType === STRUCTURE_CONTROLLER)
    .forEach(structure => {
      intrestPoints.push(structure.pos);
    });
  // Initialize distanceGrid for the wall positions.
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (Memory.rooms[roomName].distanceMap[x][y] >= 3) {
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

  potentialSpawnPos.forEach((spawnPos, index) => {
    Game.rooms[roomName].visual.text(pathLengths[index].toString(), spawnPos.x, spawnPos.y, {
      color: "#ffffff"
    });
  });

  const minValue = Math.min(...pathLengths);
  const minIndex = pathLengths.indexOf(minValue);
  Memory.rooms[roomName].bestSpawnPosition = potentialSpawnPos[minIndex];

  Game.rooms[roomName].visual.rect(
    Memory.rooms[roomName].bestSpawnPosition.x - 0.5,
    Memory.rooms[roomName].bestSpawnPosition.y - 0.5,
    1,
    1,
    {
      fill: "#00ff01"
    }
  );

  return potentialSpawnPos;
}
