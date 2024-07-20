export interface State {
  enter?(creep: Creep): void;
  execute(creep: Creep): void;
  exit?(creep: Creep): void;
}

export interface Transition {
  from: State | null;
  to: State;
  condition: (creep: Creep) => boolean;
  priority: number;
}

export interface CreepStrategy {
  work: (name: string) => void;
}

export interface CreepMind {
  name: string;
  strategy: CreepStrategy;
}

export class StateMachine {
  private currentState: State;
  private states: State[];
  private transitions: Transition[];

  public constructor(currentState: State, states: State[], transitions: Transition[]) {
    this.currentState = currentState;
    this.states = states;
    this.transitions = transitions;
  }

  public update(creep: Creep): void {
    const possibleTransitions = this.transitions
      .filter(t => t.from === this.currentState || t.from === null)
      .sort((a, b) => b.priority - a.priority);

    const transition = possibleTransitions.find(t => t.condition(creep));
    if (transition) {
      // Exit the current state
      this.currentState?.exit?.(creep);

      // Switch to the new state
      this.currentState = transition.to;

      // Enter the new state
      this.currentState?.enter?.(creep);
    }

    this.currentState?.execute(creep);
  }
}
