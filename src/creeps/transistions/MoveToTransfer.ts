import { Transition } from "../StateMachine";
import { MOVE_STATE, StateType, TRANSFER_STATE, UPGRADE_STATE } from "../States";

export class MoveToUpgrade implements Transition {
  public condition(creep: Creep): boolean {
    return (
      creep.memory.target?.goal === TRANSFER_STATE &&
      creep.pos.inRangeTo(creep.memory.target.roomPosition.x, creep.memory.target.roomPosition.y, 1)
    );
  }
  public readonly from: StateType = MOVE_STATE;
  public readonly to: StateType = UPGRADE_STATE;
}
