import { Transition } from "../StateMachine";
import { MOVE_STATE, StateType } from "../States";

export class NullToMove implements Transition {
  public condition(creep: Creep): boolean {
    return creep.memory.state === null;
  }
  public execute(creep: Creep): boolean {
    const tmpTarget = creep.pos.findClosestByPath(FIND_SOURCES);
    if (tmpTarget) {
      creep.memory.target = { id: tmpTarget.id, roomPosition: tmpTarget.pos, type: RESOURCE_ENERGY };
      return true;
    } else {
      creep.memory.target = null;
      return false;
    }
  }
  public readonly from: null = null;
  public readonly priority: number = 10;
  public readonly to: StateType = MOVE_STATE;
}
