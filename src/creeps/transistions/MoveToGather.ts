import { Transition } from "../StateMachine";
import { GATHER_STATE, MOVE_STATE, StateType } from "../States";

export class MoveToGather implements Transition {
  public condition(creep: Creep): boolean {
    return (
      creep.memory.target?.goal === GATHER_STATE &&
      creep.pos.inRangeTo(creep.memory.target.roomPosition.x, creep.memory.target.roomPosition.y, 1)
    );
  }

  public readonly from: StateType = MOVE_STATE;
  public readonly to: StateType = GATHER_STATE;
}
