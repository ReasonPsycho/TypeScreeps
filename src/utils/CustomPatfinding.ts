// eslint-disable-next-line max-classes-per-file
import { lerpColor } from "./Visual";

export class CustomPathFindingGrid {
  private dx = [0, 1, 0, -1, -1, -1, 1, 1];
  private dy = [1, 0, -1, 0, 1, -1, 1, -1];

  public tiles: PathFindingTile[];
  public openQueue: PathFindingTile[] = [];
  public closedArray: PathFindingTile[] = [];
  public roomName: string;
  public valueMap: number[][];
  public sources: Source[];
  public minerals: Mineral[];

  public constructor(tiles: PathFindingTile[], sources: Source[], minerals: Mineral[], roomName: string) {
    this.tiles = tiles;
    this.sources = sources;
    this.minerals = minerals;
    this.roomName = roomName;
  }

  public setUpGrid(conditionFunction: (tile: PathFindingTile) => boolean): void {
    this.tiles.forEach(tile => {
      if (conditionFunction(tile)) {
        this.openQueue.push(tile);
        this.closedArray.push(tile);
      }
    });
  }

  public pushToClosed(conditionFunction: (tile: PathFindingTile) => boolean): void {
    this.tiles.forEach(tile => {
      if (conditionFunction(tile)) {
        this.closedArray.push(tile);
      }
    });
  }

  public execute() {
    while (this.openQueue.length) {
      const tile = this.openQueue.shift();

      for (let i = 0; i < 8; i++) {
        const neighbourTile = this.getTile(tile.pos.x + this.dx[i], tile.pos.y + this.dy[i]);
        if (neighbourTile && !this.closedArray.includes(neighbourTile)) {
          neighbourTile.value = tile.value + 1;
          this.closedArray.push(neighbourTile);
          this.openQueue.push(neighbourTile);
        }
      }
    }
    this.valueMap = this.getValueMap();
  }

  public getTile(x: number, y: number): PathFindingTile | undefined {
    return this.tiles.find(tile => tile.pos.x === x && tile.pos.y === y);
  }

  private getValueMap(): number[][] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const map: number[][] = Array(50)
      .fill(0)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .map(() => Array(50).fill(0));
    for (let y = 0; y < 50; y++) {
      for (let x = 0; x < 50; x++) {
        map[x][y] = this.getTile(x, y).value;
      }
    }
    return map;
  }

  public visualMap(): void {
    visualMap(this.valueMap, this.roomName);
  }

  public clear(): void {
    for (let x = 0; x < 50; x++) {
      for (let y = 0; y < 50; y++) {
        this.getTile(x, y).value = 0;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.closedArray = Array(0);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.openQueue = Array(0);
      }
    }
  }
}

export class PathFindingTile {
  public pos: { x: number; y: number };
  public terrain: Terrain;
  public structures: Structure[];
  public exit: boolean;
  public value: number;

  public constructor(x: number, y: number, terrain: Terrain, structures: Structure[], exit: boolean) {
    this.pos = { x, y };
    this.terrain = terrain;
    this.structures = structures;
    this.exit = exit;
    this.value = 0;
  }

  public getNeighbourPositions(): { x: number; y: number }[] {
    const { x, y } = this.pos;
    // All eight directions
    const directions = [
      { x: x - 1, y: y - 1 }, // top-left
      { x, y: y - 1 }, // top
      { x: x + 1, y: y - 1 }, // top-right
      { x: x - 1, y }, // left
      { x: x + 1, y }, // right
      { x: x - 1, y: y + 1 }, // bottom-left
      { x, y: y + 1 }, // bottom
      { x: x + 1, y: y + 1 } // bottom-right
    ];
    return directions;
  }
}

export function visualMap(map: number[][], roomName: string): void {
  const maxValue = Math.max(...[].concat(...map));
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
      if (map[x][y] > 0) {
        Game.rooms[roomName].visual.text(map[x][y].toFixed(1), x, y, {
          color: "#ffffff",
          font: 0.4
        });
        Game.rooms[roomName].visual.rect(x - 0.5, y - 0.5, 1, 1, {
          fill: lerpColor("#004eff", "#ff0000", map[x][y] / maxValue)
        });
      }
    }
  }
}

export function visualBuildingPlan(roomName: string): void {
  Memory.rooms[roomName].plannedBuildings.forEach(buildingPlan =>
    Game.rooms[roomName].visual.text(buildingPlan.structureType, buildingPlan.pos.x, buildingPlan.pos.y, {
      color: "#ffffff",
      font: 0.3
    })
  );

  Memory.rooms[roomName].possibleStructurePositions.forEach(pos => {
    Game.rooms[roomName].visual.circle(pos.x, pos.y, { radius: 0.2 });
  });
}
