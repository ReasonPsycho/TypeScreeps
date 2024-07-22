import { Transition } from "../StateMachine";
import { MOVE_STATE, StateType, UPGRADE_STATE } from "../States";

export class UpgradeToMove implements Transition {
  public readonly condition = (creep: Creep): boolean => {
    return creep.store.energy === 0;
  };
  public execute(creep: Creep): boolean {
    const tmpTarget = creep.pos.findClosestByPath(FIND_SOURCES);
    if (tmpTarget) {
      creep.memory.target = { id: tmpTarget.id, roomPosition: tmpTarget.pos, goal: UPGRADE_STATE };
      return true;
    } else {
      creep.memory.target = null;
      return false;
    }
  }
  public readonly from: StateType = UPGRADE_STATE;
  public readonly to: StateType = MOVE_STATE;
}
