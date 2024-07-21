import { State } from "../StateMachine";

export class Gather implements State {
  public execute(creep: Creep): boolean {
    if (creep.memory.target) {
      const source: Source | null = Game.getObjectById<Source>(creep.memory.target.id);
      if (source) {
        return creep.harvest(source) === OK;
      }
    }
    return false;
  }

  public exit(creep: Creep): void {
    creep.memory.target = null;
  }
}
