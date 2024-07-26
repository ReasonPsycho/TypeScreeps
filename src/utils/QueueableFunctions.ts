import SourceDistance from "./SourceDistance";
import WallDistance from "./WallDistance";
import ExitDistance from "./ExitDistance";
import ControllerDistance from "./ControllerDistance";
import FindBestSpotForSpawn from "./FindBestSpotForSpawn";

export const MAP_SOURCE_DISTANCE = "MapSource";
export const MAP_WALL_DISTANCE = "MapWalls";
export const MAP_CONTROLLER_DISTANCE = "MapController";
export const MAP_EXIT_DISTANCE = "MapExit";
export const FIND_BEST_SPAWN_POS = "FindBestSpawnPos";

export const QueueableFunctions = {
  [MAP_SOURCE_DISTANCE]: SourceDistance,
  [MAP_WALL_DISTANCE]: WallDistance,
  [MAP_CONTROLLER_DISTANCE]: ControllerDistance,
  [MAP_EXIT_DISTANCE]: ExitDistance,
  [FIND_BEST_SPAWN_POS]: FindBestSpotForSpawn
};

export type QueueableFunctionType = keyof typeof QueueableFunctions;
