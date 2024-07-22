import { Gather } from "./states/Gather";
import { Move } from "./states/Move";
import { Upgrade } from "./states/Upgrade";
import { Transfer } from "./states/Transfer";

export const GATHER_STATE = "Gather";
export const MOVE_STATE = "Move";
export const UPGRADE_STATE = "Upgrade";
export const TRANSFER_STATE = "Transfer";

export const States = {
  [GATHER_STATE]: new Gather(),
  [MOVE_STATE]: new Move(),
  [UPGRADE_STATE]: new Upgrade(),
  [TRANSFER_STATE]: new Transfer()
};

export type StateType = keyof typeof States;
