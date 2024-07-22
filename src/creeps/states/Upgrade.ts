import { State } from "../StateMachine";

export class Upgrade implements State {
  public execute(creep: Creep): boolean {
    if (creep.memory.target) {
      const controller: StructureController | null = Game.getObjectById<StructureController>(creep.memory.target.id);
      if (controller) {
        return creep.upgradeController(controller) === OK;
      }
    }
    return false;
  }

  public exit(creep: Creep): void {
    creep.memory.target = null;
  }

  public readonly priority: number = 8;
}
