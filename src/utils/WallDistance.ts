import { lerpColor } from "./Visual";

export class CustomPathFindingGrid {
  private dx = [0, 1, 0, -1, -1, -1, 1, 1];
  private dy = [1, 0, -1, 0, 1, -1, 1, -1];

  public tiles: PathFindingTile[];
  public openQueue: PathFindingTile[] = [];
  public closedArray: PathFindingTile[] = [];

  public constructor(tiles: PathFindingTile[]) {
    this.tiles = tiles;
  }

  public pushToOpen(conditionFunction: (tile: PathFindingTile) => boolean): void {
    this.tiles.forEach(tile => {
      if (conditionFunction(tile)) {
        this.openQueue.push(tile);
        this.closedArray.push(tile);
      }
    });
  }

  public execute() {
    while (this.openQueue.length) {
      const tile = this.openQueue.shift();

      for (let i = 0; i < 8; i++) {
        const neighbourTile = this.getTile(tile.pos.x, tile.pos.y);
        if (!this.closedArray.includes(neighbourTile)) {
          neighbourTile.value = tile.value + 1;
          this.closedArray.push(tile);
          this.openQueue.push(tile);
        }
      }
    }
  }

  public getTile(x: number, y: number): PathFindingTile | undefined {
    return this.tiles.find(tile => tile.pos.x === x && tile.pos.y === y);
  }
}

class PathFindingTile {
  public pos: { x: number; y: number };
  public terrain: Terrain;
  public value: number;

  public constructor(x: number, y: number, terrain: Terrain) {
    this.pos = { x, y };
    this.terrain = terrain;
    this.value = 0;
  }
}

Room.prototype.getCustomGrid = function (this: Room): any {
  const terrain = this.getTerrain();
  const tiles: PathFindingTile[] = [];
  // Initialize distanceGrid for the wall positions.
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
      tiles.push(
        new PathFindingTile(
          x,
          y,
          terrain.get(x, y) === 0 ? "plain" : terrain.get(x, y) === TERRAIN_MASK_SWAMP ? "swamp" : "wall"
        )
      );
    }
  }
  return new CustomPathFindingGrid(tiles);
};

export default function WallDistance(roomName: string): number[][] {
  const customGrid = Game.rooms[roomName].getCustomGrid();

  customGrid.forEach(tile => {});
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
      distanceMap[x][y] = 0;
      customGrid.push(new R());
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
