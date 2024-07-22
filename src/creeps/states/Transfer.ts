import { State } from "../StateMachine";

export class Transfer implements State {
  public execute(creep: Creep): boolean {
    if (creep.memory.target) {
      const target: StructureSpawn | null = Game.getObjectById<StructureSpawn>(creep.memory.target.id);
      if (target) {
        return creep.transfer(target, RESOURCE_ENERGY) === OK;
      }
    }
    return false;
  }

  public exit(creep: Creep): void {
    creep.memory.target = null;
  }

  public readonly priority: number = 8;
}
