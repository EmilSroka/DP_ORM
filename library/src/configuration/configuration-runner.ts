export class ConfigurationRunner {
  private cbs = [];

  add(cb: () => void) {
    this.cbs.push(cb);
  }

  run() {
    for (const cb of this.cbs) {
      cb();
    }
  }
}
