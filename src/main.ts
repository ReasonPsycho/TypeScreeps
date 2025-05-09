import { ErrorMapper } from "utils/ErrorMapper";
import { StateType } from "./creeps/States";
import { RoleTypes, Roles } from "./creeps/Roles";

import {
  EXIT_CENTER_DISTANCE,
  FIND_BEST_SPAWN_POS,
  FIND_BEST_SPOT_CONTROLLER,
  MAP_CONTROLLER_DISTANCE,
  MAP_EXIT_DISTANCE,
  MAP_MINERALS_DISTANCE,
  MAP_SOURCE_DISTANCE,
  MAP_WALL_DISTANCE,
  PLAN_CENTER,
  PLAN_CONTROLLER,
  PLAN_LABS,
  PLAN_MINES,
  PLAN_POSSIBLE_STRUCTURE_POSITIONS,
  PLAN_REST,
  PLAN_ROADS,
  PLAN_TOWERS,
  QueueableFunctionType,
  QueueableFunctions
} from "./utils/QueueableFunctions";
import { CustomPathFindingGrid, PathFindingTile, visualBuildingPlan } from "./utils/CustomPatfinding";

declare global {
  interface Memory {
    uuid: number;
    log: any;
  }

  interface Room {
    getCustomGrid: () => CustomPathFindingGrid;
  }

  interface QueuedFunctionMemory {
    functionType: QueueableFunctionType;
    inputVariables: any;
  }

  export enum StructureAttribute {
    PRIORITY = "priority", // For high-priority structures
    TEMPORARY = "temporary", // For temporary or test structures
    CRITICAL = "critical", // For critical structures, e.g., essential for base functionality
    DEFENSE = "defense", // For defensive structures like walls or towers
    STORAGE = "storage", // For storage-related structures
    UTILITY = "utility" // Other special-purpose structures
  }

  interface PlannedBuilding {
    structureType: StructureConstant;
    pos: { x: number; y: number };
    StructureAttribute?: StructureAttribute[];
  }

  interface CreepMemory {
    role: RoleTypes;
    state: StateType | null;
    target: Target | null | undefined;
  }

  interface RoomMemory {
    distanceMaps: { [key: string]: number[][] | undefined };
    bestSpawnPosition: RoomPosition | undefined;
    bestControllerPosition: RoomPosition | undefined;
    plannedBuildings: PlannedBuilding[];
    possibleStructurePositions: RoomPosition[];
    sourceMines: RoomPosition[];
    mineralMines: RoomPosition[];
  }

  interface Target {
    roomPosition: RoomPosition;
    id: Id<_HasId>;
    goal: StateType | null | undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // IDK why eslint is so anal, but it doesn't work otherwise
    interface Global {
      log: any;
      queuedFunctions: QueuedFunctionMemory[];
      setUp(): void;
      plan(roomName: string): void;
    }
  }
}

Room.prototype.getCustomGrid = function (this: Room): any {
  const terrain = this.getTerrain();
  const exits = this.find(FIND_EXIT);
  const sources = this.find(FIND_SOURCES);
  const minerals = this.find(FIND_MINERALS);
  const tiles: PathFindingTile[] = [];
  // Initialize distanceGrid for the wall positions.
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
      tiles.push(
        new PathFindingTile(
          x,
          y,
          terrain.get(x, y) === 0 ? "plain" : terrain.get(x, y) === TERRAIN_MASK_SWAMP ? "swamp" : "wall",
          this.lookForAt(LOOK_STRUCTURES, x, y),
          exits.some(exit => exit.x === x && exit.y === y)
        )
      );
    }
  }
  return new CustomPathFindingGrid(tiles, sources, minerals, this.name);
};

global.setUp = () => {
  // Add your setup code here
  console.log("Setup complete");
};

global.plan = roomName => {
  Memory.rooms[roomName] = {
    distanceMaps: {},
    bestSpawnPosition: undefined,
    bestControllerPosition: undefined,
    plannedBuildings: [],
    possibleStructurePositions: [],
    sourceMines: [],
    mineralMines: []
  };
  global.queuedFunctions.push({ functionType: MAP_WALL_DISTANCE, inputVariables: roomName });
  global.queuedFunctions.push({ functionType: MAP_SOURCE_DISTANCE, inputVariables: roomName });
  global.queuedFunctions.push({ functionType: MAP_MINERALS_DISTANCE, inputVariables: roomName });
  global.queuedFunctions.push({ functionType: MAP_CONTROLLER_DISTANCE, inputVariables: roomName });
  global.queuedFunctions.push({ functionType: MAP_EXIT_DISTANCE, inputVariables: roomName });
  global.queuedFunctions.push({ functionType: FIND_BEST_SPAWN_POS, inputVariables: roomName });
  global.queuedFunctions.push({ functionType: PLAN_CENTER, inputVariables: roomName });
  global.queuedFunctions.push({ functionType: EXIT_CENTER_DISTANCE, inputVariables: roomName });
  global.queuedFunctions.push({ functionType: FIND_BEST_SPOT_CONTROLLER, inputVariables: roomName });
  global.queuedFunctions.push({ functionType: PLAN_CONTROLLER, inputVariables: roomName });
  global.queuedFunctions.push({ functionType: PLAN_POSSIBLE_STRUCTURE_POSITIONS, inputVariables: roomName });
  global.queuedFunctions.push({ functionType: PLAN_MINES, inputVariables: roomName });
  global.queuedFunctions.push({ functionType: PLAN_ROADS, inputVariables: roomName });
  global.queuedFunctions.push({ functionType: PLAN_LABS, inputVariables: roomName });
  global.queuedFunctions.push({ functionType: PLAN_TOWERS, inputVariables: roomName });
  global.queuedFunctions.push({ functionType: PLAN_REST, inputVariables: roomName });
};

global.queuedFunctions = [];

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // console.log(JSON.stringify(Memory));
  // Automatically delete memory of missing creeps
  if (!Memory.creeps) {
    Memory.creeps = {};
  }
  if (!Memory.rooms) {
    Memory.rooms = {};
  }

  if (global.queuedFunctions.length > 0) {
    const queuedFunction = global.queuedFunctions.shift();
    QueueableFunctions[queuedFunction.functionType](queuedFunction.inputVariables as string);
  }

  if (Memory.creeps && Object.keys(Memory.creeps).length < 8) {
    for (const name in Game.rooms) {
      const spawns = Game.rooms[name].find(FIND_MY_SPAWNS);
      if (Array.isArray(spawns) && spawns.length > 0) {
        const creepMemory: CreepMemory = {
          role: "Grunt",
          target: null,
          state: null
        };
        spawns[0].spawnCreep([MOVE, WORK, CARRY], Game.time.toString(), {
          memory: creepMemory
        });
      }
    }
  }

  for (const name in Memory.rooms) {
    visualBuildingPlan(name);
  }

  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    } else {
      if (Memory.creeps[name]?.role) {
        Roles[Memory.creeps[name].role].update(Game.creeps[name]);
      }
    }
  }

  if (Game.cpu.bucket >= 10000) {
    Game.cpu.generatePixel();
  }
});
