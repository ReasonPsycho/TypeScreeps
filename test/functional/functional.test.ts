import { assert } from "chai";
import { helper, playerRoom } from "../helper";

describe("functional", () => {
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
        console.log(`Condition was met at tick number ${i}`);
        return;
      }
      await helper.server.tick();
    }

    throw new Error('Condition was not met within 1000 iterations');
  });
});
