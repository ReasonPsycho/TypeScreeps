import { Transition } from "../StateMachine";
import { Gather } from "../states/Gather";
import { GATHER_STATE, MOVE_STATE, States, StateType } from "../States";

export class GatherToMove implements Transition {
  public condition(creep: Creep): boolean {
    return creep.store.energy === creep.store.getCapacity(RESOURCE_ENERGY);
  }
  public execute(creep: Creep): boolean {
    const tmpTarget = creep.room.controller;
    if (tmpTarget) {
      creep.memory.target = { id: tmpTarget.id, roomPosition: tmpTarget.pos, type: STRUCTURE_CONTROLLER };
      return true;
    } else {
      creep.memory.target = null;
      return false;
    }
  }
  public readonly from: StateType = GATHER_STATE;
  public readonly priority: number = 5;
  public readonly to: StateType = MOVE_STATE;
}
