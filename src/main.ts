import { ErrorMapper } from "utils/ErrorMapper";
import { StateType } from "./creeps/States";
import { Roles, RoleTypes } from "./creeps/Roles";

declare global {
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: RoleTypes;
    state: StateType | null;
    target: Target | null | undefined;
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
      setUp(): void;
    }
  }
}

global.setUp = () => {
  // Add your setup code here
  console.log("Setup complete");
};

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // console.log(JSON.stringify(Memory));
  console.log("test");
  // Automatically delete memory of missing creeps
  if (!Memory.creeps) {
    Memory.creeps = {};
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
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    } else {
      if (Memory.creeps[name]?.role) {
        Roles[Memory.creeps[name].role].update(Game.creeps[name]);
      }
    }
  }
});
