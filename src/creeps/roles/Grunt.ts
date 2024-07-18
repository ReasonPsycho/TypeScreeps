import { CreepStrategy } from "../Creep";

export class GruntCreepStrategy implements CreepStrategy {
  public work(name: string): void {
    let creepMemory = Memory.creeps[name];
    if (!creepMemory.state) {
      creepMemory.state = "Gather";
      creepMemory.target = null;
    }
    Game.creeps[name].say(creepMemory.state);
    switch (creepMemory.state) {
      case "Gather":
        if (Game.creeps[name].store.energy === 100) {
          creepMemory.state = "Upgrade";
          creepMemory.target = null;
        }
        if (!creepMemory.target) {
          const tmpTarget = Game.creeps[name].pos.findClosestByPath(FIND_SOURCES);
          creepMemory.target = tmpTarget;
          creepMemory.targetPos = tmpTarget?.pos;
        }
        console.log(Game.creeps[name].pos);
        if (creepMemory.targetPos && Game.creeps[name].pos.isNearTo(creepMemory.targetPos)) {
          if (creepMemory.target instanceof Source) Game.creeps[name].harvest(creepMemory.target);
        } else {
          if (creepMemory.targetPos instanceof RoomPosition) Game.creeps[name].moveTo(creepMemory.targetPos);
        }
        break;
      case "Upgrade":
        console.log(Game.creeps[name].store.energy);
        console.log(Game.creeps[name].store.getCapacity(RESOURCE_ENERGY));
        if (Game.creeps[name].store.energy >= Game.creeps[name].store.getCapacity(RESOURCE_ENERGY)) {
          creepMemory.state = "Gather";
          creepMemory.target = null;
        }
        if (!creepMemory.target) {
          const tmpTarget = Game.rooms[creepMemory.room].controller;
          creepMemory.target = tmpTarget;
          creepMemory.targetPos = tmpTarget?.pos;
        }
        if (creepMemory.targetPos && Game.creeps[name].pos.inRangeTo(creepMemory.targetPos, 2)) {
          if (creepMemory.target instanceof StructureController)
            Game.creeps[name].transfer(creepMemory.target, RESOURCE_ENERGY);
        } else {
          if (creepMemory.targetPos instanceof RoomPosition) Game.creeps[name].moveTo(creepMemory.targetPos);
        }
        break;
    }
  }
}
