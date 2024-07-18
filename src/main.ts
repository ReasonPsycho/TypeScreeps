import { ErrorMapper } from "utils/ErrorMapper";
import { CreepImplementation } from "./creeps/Creep";
import { GruntCreepStrategy } from "./creeps/roles/Grunt";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: string;
    state: string;
    target: Source | Mineral<MineralConstant> | Deposit | StructureController | null | undefined;
    targetPos: RoomPosition | null | undefined;
    room: string;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  // Instead of a namespace, we define an interface with same name
  interface NodeJS {
    global: Global;
  }

  // Define global as a separate interface
  interface Global {
    log: any;
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // Automatically delete memory of missing creeps
  if (Memory.creeps && Object.keys(Memory.creeps).length < 5) {
    for (const name in Game.rooms) {
      const spawns = Game.rooms[name].find(FIND_MY_SPAWNS);
      if (Array.isArray(spawns) && spawns.length > 0) {
        const creepMemory: CreepMemory = {
          role: "Grunt",
          target: null,
          targetPos: null,
          room: name,
          state: ""
        };
        spawns[0].spawnCreep([MOVE, WORK, CARRY], Game.time.toString(), {
          memory: creepMemory
        });
      }
    }
  }
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    } else {
      const gruntCreep = new CreepImplementation(name, new GruntCreepStrategy());
      gruntCreep.work(); // This will execute Grunt's work
    }
  }
});
