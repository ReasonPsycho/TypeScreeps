import { State } from "../StateMachine";

export class Move implements State {
  public execute(creep: Creep): boolean {
    if (creep.memory.target) {
      const returnCode = creep.moveTo(creep.memory.target.roomPosition.x, creep.memory.target.roomPosition.y);
      return returnCode === OK || returnCode === ERR_TIRED;
    }
    return false;
  }

  public exit(creep: Creep): void {
    creep.memory.target = null;
  }
}
