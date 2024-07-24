import { lerpColor } from "./Visual";

export default function WallDistance(roomName: string): number[][] {
  const terrain = new Room.Terrain(roomName);
  const n = 50;
  const m = 50;
  const dx = [0, 1, 0, -1, -1, -1, 1, 1];
  const dy = [1, 0, -1, 0, 1, -1, 1, -1];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const distanceMap = new Array(n).fill(0).map(() => new Array(m).fill(Number.MAX_SAFE_INTEGER)) as number[][];

  const queue: number[][] = [];

  // Initialize distanceGrid for the wall positions.
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
      if (terrain.get(x, y) === TERRAIN_MASK_WALL) {
        distanceMap[x][y] = 0;
        queue.push([x, y]);
      }
    }
  }

  // Update distances using Breadth-First Search starting from each wall
  while (queue.length) {
    const [x, y] = queue.shift();
    for (let i = 0; i < 8; i++) {
      const nx = x + dx[i];
      const ny = y + dy[i];
      if (nx >= 0 && nx < n && ny >= 0 && ny < m && distanceMap[nx][ny] > distanceMap[x][y] + 1) {
        distanceMap[nx][ny] = distanceMap[x][y] + 1;
        queue.push([nx, ny]);
      }
    }
  }

  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
      if (distanceMap[x][y] > 0) {
        Game.rooms[roomName].visual.text(distanceMap[x][y].toString(), x, y, {
          color: "#ffffff"
        });
        Game.rooms[roomName].visual.rect(x - 0.5, y - 0.5, 1, 1, {
          fill: lerpColor("#004eff", "#ff0000", distanceMap[x][y] / 6)
        });
      }
    }
  }

  return distanceMap;
}
