import CenterExitsDistance from "./CenterExitsDistance";
import ControllerDistance from "./ControllerDistance";
import ExitDistance from "./ExitDistance";
import FindBestSpotForController from "./FindBestSpotForController";
import FindBestSpotForSpawn from "./FindBestSpotForSpawn";
import PlanCenter from "./PlanCenter";
import PlanController from "./PlanController";
import PlanLabs from "./PlanLabs";
import SourceDistance from "./SourceDistance";
import MineralDistance from "./MineralDistance";
import WallDistance from "./WallDistance";
import PlanPossibleStructurePositions from "./PlanPossibleStructurePositions";
import PlanMines from "./PlanMines";
import PlanRoads from "./PlanRoads";

export const MAP_SOURCE_DISTANCE = "MapSource";
export const MAP_MINERALS_DISTANCE = "MapMinerals";
export const MAP_WALL_DISTANCE = "MapWalls";
export const MAP_CONTROLLER_DISTANCE = "MapController";
export const MAP_EXIT_DISTANCE = "MapExit";
export const FIND_BEST_SPAWN_POS = "FindBestSpawnPos";
export const PLAN_CENTER = "PlanCenter";
export const PLAN_CONTROLLER = "PlanController";
export const PLAN_POSSIBLE_STRUCTURE_POSITIONS = "PlanPossibleStructurePositions";
export const PLAN_LABS = "PlanLabs";
export const FIND_BEST_SPOT_CONTROLLER = "FindBestControllerPos";
export const EXIT_CENTER_DISTANCE = "CenterExitsDistance";
export const PLAN_MINES = "PlanMines";
export const PLAN_ROADS = "PlanRoads";

export const QueueableFunctions = {
  [MAP_SOURCE_DISTANCE]: SourceDistance,
  [MAP_MINERALS_DISTANCE]: MineralDistance,
  [MAP_WALL_DISTANCE]: WallDistance,
  [MAP_CONTROLLER_DISTANCE]: ControllerDistance,
  [MAP_EXIT_DISTANCE]: ExitDistance,
  [FIND_BEST_SPAWN_POS]: FindBestSpotForSpawn,
  [PLAN_CENTER]: PlanCenter,
  [EXIT_CENTER_DISTANCE]: CenterExitsDistance,
  [PLAN_CONTROLLER]: PlanController,
  [FIND_BEST_SPOT_CONTROLLER]: FindBestSpotForController,
  [PLAN_POSSIBLE_STRUCTURE_POSITIONS]: PlanPossibleStructurePositions,
  [PLAN_LABS]: PlanLabs,
  [PLAN_MINES]: PlanMines,
  [PLAN_ROADS]: PlanRoads
};

export type QueueableFunctionType = keyof typeof QueueableFunctions;
