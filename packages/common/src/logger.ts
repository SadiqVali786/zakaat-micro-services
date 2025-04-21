export class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  public info(message: string, ...args: any[]): void {
    console.log(`[INFO] ${this.getTimestamp()} - ${message}`, ...args);
  }

  public error(message: string, ...args: any[]): void {
    console.error(`[ERROR] ${this.getTimestamp()} - ${message}`, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] ${this.getTimestamp()} - ${message}`, ...args);
  }
}
