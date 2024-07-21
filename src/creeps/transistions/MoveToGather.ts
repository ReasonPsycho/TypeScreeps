import { Transition } from "../StateMachine";
import { Move } from "../states/Move";
import { Gather } from "../states/Gather";
import { GATHER_STATE, MOVE_STATE, StateType, UPGRADE_STATE } from "../States";

export class MoveToGather implements Transition {
  public condition(creep: Creep): boolean {
    return (
      creep.memory.target?.type === RESOURCE_ENERGY &&
      creep.pos.inRangeTo(creep.memory.target.roomPosition.x, creep.memory.target.roomPosition.y, 1)
    );
  }

  public readonly from: StateType = MOVE_STATE;
  public readonly priority: number = 5;
  public readonly to: StateType = GATHER_STATE;
}
