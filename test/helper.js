const { readFileSync } = require("fs");
const _ = require("lodash");
const { ScreepsServer, stdHooks } = require("screeps-server-mockup");
const DIST_MAIN_JS = "dist/main.js";

const playerRoom = "W0N1";

// Helper class for creating a ScreepsServer and resetting it between tests.
class IntegrationTestHelper {
  _server;
  _player;

  get server() {
    return this._server;
  }

  get player() {
    return this._player;
  }

  async beforeEach() {
    this._server = new ScreepsServer();

    // Reset world but add invaders and source keepers bots
    await this._server.world.reset();

    // Create a stub world composed of 9 rooms with sources and controller
    await this._server.world.stubWorld();

    // Add a player with the built dist/main.js file
    const modules = {
      main: readFileSync(DIST_MAIN_JS).toString()
    };

    this._player = await this._server.world.addBot({ username: "player", room: playerRoom, x: 20, y: 15, modules });

    this._player.on("console", (logs, results, userid, username) => {
      _.each(logs, (line) => console.log(`[console|${username}]`, line));
    });

    // Start server
    await this._server.start();
  }

  async afterEach() {
    await this._server.stop();
  }
}

const helper = new IntegrationTestHelper();

beforeEach(async () => {
  await helper.beforeEach();
});

afterEach(async () => {
  await helper.afterEach();
});

before(() => {
  stdHooks.hookWrite();
});

// Use CommonJS exports
module.exports = {
  playerRoom,
  helper
};
