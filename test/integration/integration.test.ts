import { assert } from "chai";
import { helper, playerRoom } from "./helper";

describe("main", () => {
  it("runs a server and matches the game tick", async function () {
    for (let i = 1; i < 10; i += 1) {
      assert.equal(await helper.server.world.gameTime, i);
      await helper.server.tick();
    }
  });

  it("writes and reads to memory", async function () {
    await helper.player.console(`Memory.foo = 'bar'`);
    await helper.server.tick();
    const memory = JSON.parse(await helper.player.memory);
    assert.equal(memory.foo, "bar");
  });

  it("earns energy", async function () {
    this.timeout(60000);

    for (let i = 1; i < 1000; i += 1) {
      const objects = await helper.server.common.storage.db["rooms.objects"].find({
        room: playerRoom,
        type: "controller"
      });

      const controller = objects[0]; // since your array contains only one object
      const progress = controller.progress;
      if (progress > 0) {
        return;
      }
      await helper.server.tick();
    }

    throw new Error('Condition was not met within 1000 iterations');
  });
});
