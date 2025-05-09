const { assert } = require("chai");
const { helper, playerRoom } = require("../helper");

describe("integration", () => {
  it("runs a server and matches the game tick", async function () {
    for (let i = 1; i < 10; i += 1) {
      assert.equal(await helper.server.world.gameTime, i);
      await helper.server.tick();
    }
  });

  it("Writes and reads to memory", async function () {
    await helper.player.console(`Memory.foo = 'bar'`);
    await helper.server.tick();
    const memory = JSON.parse(await helper.player.memory);
    console.log(memory);
    assert.equal(memory.foo, "bar");
  });
});
