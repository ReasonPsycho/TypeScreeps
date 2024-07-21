import { State, StateMachine, Transition } from "../StateMachine";
import { GatherToMove } from "../transistions/GatherToMove";
import { MoveToGather } from "../transistions/MoveToGather";
import { MoveToUpgrade } from "../transistions/MoveToUpgrade";
import { UpgradeToMove } from "../transistions/UpgradeToMove";
import { NullToMove } from "../transistions/NullToMove";

export class Grunt extends StateMachine {
  protected transitions: Transition[] = [
    new GatherToMove(),
    new MoveToGather(),
    new MoveToUpgrade(),
    new UpgradeToMove(),
    new NullToMove()
  ]; // Populate with your static transitions
}
