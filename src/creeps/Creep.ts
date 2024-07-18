
export interface CreepStrategy {
  work: (name: string) => void;
}

export interface CreepMind {
  name: string;
  strategy: CreepStrategy;
}

export class CreepImplementation implements CreepMind {
  public name: string;
  public strategy: CreepStrategy;

  public constructor(name: string, strategy: CreepStrategy) {
    this.name = name;
    this.strategy = strategy;
  }

  public work(): void {
    this.strategy.work(this.name);
  }
}
