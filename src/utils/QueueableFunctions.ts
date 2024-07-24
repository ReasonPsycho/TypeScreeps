import MapValue from "./MapValue";

export const MAP_VALUE_FUNCTION = "MapValue";

export const QueueableFunctions = {
  [MAP_VALUE_FUNCTION]: MapValue
};

export type QueueableFunctionType = keyof typeof QueueableFunctions;
