import { lerpColor } from "./Visual";

export default function PlanBuildings(roomName: string): void {
  const dx = [0, 0, 0, -1, +1];
  const dy = [0, -1, +1, 0, 0];
  const centralPos = Memory.rooms[roomName].bestSpawnPosition;
  if (!centralPos || centralPos.x === undefined || centralPos.y === undefined) {
    return;
  }
  Game.rooms[roomName].visual.circle(centralPos.x, centralPos.y, { radius: 0.55, stroke: "red" });
  const offsetX = (centralPos.x % 4) + 2;
  const offsetY = centralPos.y % 4;
  for (let x = 0; x < 13; x++) {
    for (let y = 0; y < 26; y++) {
      const plusCenterY = y * 2 + offsetY;
      const plusCenterX = x * 4 + offsetX - (y % 2) * 2;

      let areaValue = 0;
      let tilesCounter = 0;
      for (let z = 0; z < 5; z++) {
        const currentX = plusCenterX + dx[z];
        const currentY = plusCenterY + dy[z];
        if (currentX >= 0 && currentY >= 0 && currentX < 50 && currentY < 50) {
          if (Memory.rooms[roomName].distanceMaps.CenterExitsDistance[currentX][currentY] !== 0) {
            tilesCounter += 1;
            areaValue += Memory.rooms[roomName].distanceMaps.CenterExitsDistance[currentX][currentY];
          }
        }
      }
      if (tilesCounter > 0) {
        areaValue /= tilesCounter;
      }
      for (let z = 0; z < 5; z++) {
        const currentX = plusCenterX + dx[z];
        const currentY = plusCenterY + dy[z];
        if (currentX >= 0 && currentY >= 0 && currentX < 50 && currentY < 50) {
          if (Memory.rooms[roomName].distanceMaps.CenterExitsDistance[currentX][currentY] !== 0) {
            Game.rooms[roomName].visual.rect(currentX - 0.5, currentY - 0.5, 1, 1, {
              fill: lerpColor("#004eff", "#ff0000", areaValue / 40)
            });
            Game.rooms[roomName].visual.text(areaValue.toFixed(1), currentX, currentY, {
              color: "#ffffff",
              font: 0.4
            });
          }
        }
      }
    }
  }
}
