import { State } from "../StateMachine";

export class Upgrade implements State {
  public execute(creep: Creep): boolean {
    if (creep.memory.target) {
      const controller: StructureController | null = Game.getObjectById<StructureController>(creep.memory.target.id);
      if (controller) {
        return creep.transfer(controller, RESOURCE_ENERGY) === OK;
      }
    }
    return false;
  }

  public exit(creep: Creep): void {
    creep.memory.target = null;
  }
}
