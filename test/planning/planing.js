const { assert } = require("chai");
const { helper, playerRoom } = require("../helper");
const { TerrainMatrix } = require("screeps-server-mockup");
const { readFileSync } = require("fs");
const { server } = require("sinon");
const SHARD_JSON = "res/map-mmo-shard1.json";
const ROOM_NAME = "W59N13";

describe("planning", () => {
  it("runs a server and matches the game tick", async function () {
    this.timeout(60000);

    await helper.loadRoomFromFile(
      ROOM_NAME,
      SHARD_JSON)
    await helper.player.console(`console.log(Game.rooms['W0N1'].getTerrain())`);
    await helper.player.console(`plan("W0N1")`);
    for (let i = 1; i < 30; i += 1) {
      console.log("tick:",i.toString() );
      await helper.server.tick();
    }

    console.log(await helper.player.memory);
    const playerMemory =  JSON.parse(await helper.player.memory);
    assert.exists(playerMemory.rooms['W0N1'].bestSpawnPosition, "Expected bestSpawnPosition to exist");
    console.log("bestSpawnPosition:", playerMemory.rooms['W0N1'].bestSpawnPosition);
  });
});
