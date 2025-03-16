const { readFileSync } = require("fs");
const _ = require("lodash");
const { ScreepsServer, stdHooks, TerrainMatrix } = require("screeps-server-mockup");
const { server } = require("sinon");
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

  async loadRoomFromFile(roomName, filePath) {
    if (!this._server) {
      throw new Error("Server is not initialized. Ensure beforeEach has been called.");
    }

    await this.server.world.reset();

    const roomData = JSON.parse(readFileSync(filePath, "utf8"));
    // Validate roomData structure (optional)
    if (!roomData || typeof roomData !== "object") {
      throw new Error("Invalid room data format. Expected a JSON object.");
    }

    const roomJson = roomData.rooms.find(room => room.room === roomName)

    // Reset the room and load the new data into it
    await this._server.world.addRoom(playerRoom);

    const terrain = TerrainMatrix.unserialize(roomJson.terrain);
    await this._server.world.setTerrain(playerRoom, terrain);

    roomJson.objects.forEach(o => {
      const { type, x, y } = o;
      helper.server.world.addRoomObject("W0N1",type,x, y )
    })

    console.log(`Room '${roomName}' successfully loaded from file '${filePath}'.`);

    // Add a player with the built dist/main.js file
    const modules = {
      main: readFileSync(DIST_MAIN_JS).toString()
    };

    //TODO THIS WILL PROB SPAWN HIM IN THE WALL UGHHHHHHHH
    this._player = await this._server.world.addBot({ username: "player", room: playerRoom, x: 20, y: 15, modules });

    this._player.on("console", (logs, results, userid, username) => {
      _.each(logs, (line) => console.log(`[console|${username}]`, line));
    });

    // Start server
    await this._server.start();
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
