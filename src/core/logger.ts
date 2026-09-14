export type ILogger = {
  log(message?: string, ...optionalParams: unknown[]): void;
  info(message?: string, ...optionalParams: unknown[]): void;
  warn(message?: string, ...optionalParams: unknown[]): void;
  error(message?: string, ...optionalParams: unknown[]): void;
};

export class Logger extends console.Console implements ILogger {
  private _base = globalThis.console;

  override log(message?: string, ...optionalParams: unknown[]): void {
    super.log(`📝 ${message}`, ...optionalParams);
  }

  override info(message?: string, ...optionalParams: unknown[]): void {
    super.info(`ℹ️ ${message}`, ...optionalParams);
  }

  override warn(message?: string, ...optionalParams: unknown[]): void {
    super.warn(`⚠️ ${message}`, ...optionalParams);
  }

  override error(message?: string, ...optionalParams: unknown[]): void {
    super.error(`❌ ${message}`, ...optionalParams);
  }
}
