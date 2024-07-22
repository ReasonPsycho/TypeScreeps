import { Grunt } from "./roles/Grunt";

export const GRUNT_ROLE = "Grunt";

export const Roles = {
  [GRUNT_ROLE]: new Grunt()
};

export type RoleTypes = keyof typeof Roles;
