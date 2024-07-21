import { Gather } from "./states/Gather";
import { Move } from "./states/Move";
import { Upgrade } from "./states/Upgrade";

export const GATHER_STATE = "Gather";
export const MOVE_STATE = "Move";
export const UPGRADE_STATE = "Upgrade";

export const States = {
  [GATHER_STATE]: Gather,
  [MOVE_STATE]: Move,
  [UPGRADE_STATE]: Upgrade
};

export type StateType = keyof typeof States;
