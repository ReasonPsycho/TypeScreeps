import { CreepStrategy, State, Transition } from "../Creep";

export class Gather implements State {
  public enter(creep: Creep): void {
    const tmpTarget = creep.pos.findClosestByPath(FIND_SOURCES);
    if (tmpTarget) {
      creep.memory.target = { id: tmpTarget.id, roomPosition: tmpTarget.pos };
    } else {
      creep.memory.target = null;
    }
  }

  public execute(creep: Creep): void {
    if (creep.memory.target) {
      if (
        creep.memory.target &&
        creep.pos.isNearTo(creep.memory.target.roomPosition.x, creep.memory.target.roomPosition.y)
      ) {
        const source: Source | null = Game.getObjectById<Source>(creep.memory.target.id);
        if (source) {
          creep.harvest(source);
        }
      } else {
        creep.moveTo(creep.memory.target.roomPosition.x, creep.memory.target.roomPosition.y);
      }
      if (creep.store.energy >= creep.store.getCapacity(RESOURCE_ENERGY)) { //to transition check
        creep.memory.state = "Upgrade";
        creep.memory.target = null;
      }
    }
  }

  public exit(creep: Creep): void {
    creep.memory.target = null;
  }
}

export class Upgrade implements State {
  public enter(creep: Creep): void {
    const tmpTarget = creep.room.controller;
    if (tmpTarget) {
      creep.memory.target = { id: tmpTarget.id, roomPosition: tmpTarget.pos };
    } else {
      creep.memory.target = null;
    }
  }

  public execute(creep: Creep): void {
    if (creep.memory.target) {
      if (creep.pos.inRangeTo(creep.memory.target.roomPosition.x, creep.memory.target.roomPosition.y, 2)) {
        const controller: StructureController | null = Game.getObjectById<StructureController>(creep.memory.target.id);
        if (controller) {
          creep.transfer(controller, RESOURCE_ENERGY);
        }
      } else {
        creep.moveTo(creep.memory.target.roomPosition.x, creep.memory.target.roomPosition.y);
      }
      if (creep.store.energy === 0) { //to transition check
        creep.memory.state = "Gather";
        creep.memory.target = null;
      }
    }
  }

  public exit(creep: Creep): void {
    creep.memory.target = null;
  }
}

export class MoveToGather implements Transition {
  condition(creep: Creep): boolean {
    return false;
  }

  from: State | null;
  priority: number;
  to: State;
}

export class MoveToGather implements Transition {
  condition(creep: Creep): boolean {
    return false;
  }

  from: State | null;
  priority: number;
  to: State;
}

export class MoveToUpgrade implements Transition {
  condition(creep: Creep): boolean {
    return false;
  }

  from: State | null;
  priority: number;
  to: State;
}
