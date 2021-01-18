export class ConfigurationRunner {
  private cbs = [];
  private done = false;

  add(cb: () => void) {
    this.cbs.push(cb);
  }

  run() {
    if (this.done) return;

    for (const cb of this.cbs) {
      cb();
    }

    this.done = true;
  }
}
