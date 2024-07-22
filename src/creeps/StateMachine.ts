import { StateType, States } from "./States";

export interface State {
  enter?(creep: Creep): void;
  execute(creep: Creep): boolean;
  exit?(creep: Creep): void;
  priority: number;
}

export interface Transition {
  from: StateType | null;
  to: StateType;
  condition(creep: Creep): boolean;
  execute?(creep: Creep): boolean;
}

export class StateMachine {
  protected transitions: Transition[] = [];

  public update(creep: Creep): void {
    let state: State | null = null;
    if (creep.memory.state) {
      state = States[creep.memory.state];
    }
    const possibleTransitions = this.transitions.filter(t => t.from === creep.memory.state || t.from === null);

    if (state?.priority) {
      possibleTransitions.filter(t => States[t.to].priority <= state!.priority);
    }

    possibleTransitions.sort((a, b) => States[a.to].priority - States[b.to].priority);

    const transition = possibleTransitions.find(t => t.condition(creep));
    if (transition) {
      // Exit the current state
      state?.exit?.(creep);

      // Switch to the new state
      if (transition.execute && !transition.execute?.(creep)) {
        creep.memory.state = null;
        throw Error("Transition failed!");
      }

      // Enter the new state
      creep.memory.state = transition.to;
      state = States[creep.memory.state];
      state.enter?.(creep);
    }

    if (!state?.execute(creep)) {
      state?.exit?.(creep);
      creep.memory.state = null;
    }
  }
}
