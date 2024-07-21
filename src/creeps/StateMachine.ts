import { States, StateType } from "./States";

export interface State {
  enter?(creep: Creep): void;
  execute(creep: Creep): boolean;
  exit?(creep: Creep): void;
}

export interface Transition {
  from: StateType | null;
  to: StateType;
  condition(creep: Creep): boolean;
  execute?(creep: Creep): boolean;
  priority: number;
}

export class StateMachine {
  protected transitions: Transition[] = [];

  public update(creep: Creep): void {
    let state: State | null = null;
    if (creep.memory.state) {
      state = new States[creep.memory.state]();
    }
    const possibleTransitions = this.transitions
      .filter(t => t.from === creep.memory.state || t.from === null)
      .sort((a, b) => a.priority - b.priority);

    console.log("-----------------------");
    console.log(creep.name);
    console.log(JSON.stringify(creep.memory.target));
    console.log(JSON.stringify(possibleTransitions));
    const transition = possibleTransitions.find(t => t.condition(creep));
    console.log(JSON.stringify(transition));
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
      state = new States[creep.memory.state]();
      state.enter?.(creep);
    }

    if (!state?.execute(creep)) {
      state?.exit?.(creep);
      creep.memory.state = null;
    }
  }
}
