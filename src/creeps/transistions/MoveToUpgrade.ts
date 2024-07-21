import { Transition } from "../StateMachine";
import { Move } from "../states/Move";
import { Upgrade } from "../states/Upgrade";
import { GATHER_STATE, MOVE_STATE, StateType, UPGRADE_STATE } from "../States";

export class MoveToUpgrade implements Transition {
  public condition(creep: Creep): boolean {
    return (
      creep.memory.target?.type === STRUCTURE_CONTROLLER &&
      creep.pos.inRangeTo(creep.memory.target.roomPosition.x, creep.memory.target.roomPosition.y, 2)
    );
  }
  public readonly from: StateType = MOVE_STATE;
  public readonly priority: number = 5;
  public readonly to: StateType = UPGRADE_STATE;
}
