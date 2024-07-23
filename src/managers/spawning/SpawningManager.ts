interface SpawnMemory {
  queue: SpawnCommand[];
}

interface SpawnCommand {
  name: string;
  priority: number;
  body: BodyPartConstant[];
  opts?: SpawnOptions;
}

export class SpawningManager {
  protected spawnMemory: SpawnMemory;

  public constructor(spawnMemory: SpawnMemory) {
    this.spawnMemory = spawnMemory;
  }

  public enqueue(item: SpawnCommand): void {
    this.spawnMemory.queue.push(item);
  }

  public dequeue(): SpawnCommand | undefined {
    return this.spawnMemory.queue.shift();
  }

  public isEmpty(): boolean {
    return this.spawnMemory.queue.length === 0;
  }

  public peek(): SpawnCommand | undefined {
    return this.spawnMemory.queue[0];
  }

  public length(): number {
    return this.spawnMemory.queue.length;
  }

  public update(creep: Creep): void {}
}
