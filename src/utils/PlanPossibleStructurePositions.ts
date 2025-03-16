export default function PlanPossibleStructurePositions(roomName: string): void {
  const dx = [0, 0, 0, -1, +1];
  const dy = [0, -1, +1, 0, 0];
  const centralPos = Memory.rooms[roomName].bestSpawnPosition;
  if (!centralPos || centralPos.x === undefined || centralPos.y === undefined) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const map: number[][] = Array(50)
    .fill(0)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .map(() => Array(50).fill(0));

  const offsetX = (centralPos.x % 4) + 2;
  const offsetY = centralPos.y % 4;
  for (let x = 0; x < 13; x++) {
    for (let y = 0; y < 26; y++) {
      const plusCenterY = y * 2 + offsetY;
      const plusCenterX = x * 4 + offsetX - (y % 2) * 2;

      for (let z = 0; z < 5; z++) {
        const currentX = plusCenterX + dx[z];
        const currentY = plusCenterY + dy[z];
        if (
          currentX >= 0 &&
          currentY >= 0 &&
          currentX < 50 &&
          currentY < 50 &&
          !Memory.rooms[roomName].plannedBuildings.some(
            building => building.pos.x === currentX && building.pos.y === currentY
          )
        ) {
          map[currentX][currentY] = Memory.rooms[roomName].distanceMaps.CenterExitsDistance[currentX][currentY];
        }
      }
    }
  }

  const validPositions: { x: number; y: number; value: number }[] = [];
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      if (map[i][j] !== 0) {
        validPositions.push({ x: i, y: j, value: map[i][j] });
      }
    }
  }

  validPositions.sort((a, b) => a.value - b.value);
  const bestPositions = validPositions.slice(0, 79);

  // Storing the best positions
  const roomObjects = bestPositions.map(pos => ({ x: pos.x, y: pos.y, value: pos.value }));

  roomObjects.forEach(pos => {
    Game.rooms[roomName].visual.circle(pos.x, pos.y, { radius: 0.2 });
  });

  Memory.rooms[roomName].possibleStructurePositions = roomObjects.map(
    (pos): RoomPosition => new RoomPosition(pos.x, pos.y, roomName)
  );
}
