export class Logger {
  info(message: string, name?: string) {
    console.info(`\x1b[34m[INFO]${name ? `\x1b[33m[${name}]` : ''}\x1b[0m ${message}`);
  }
  error(message: string, name?: string) {
    console.error(`\x1b[31m[ERROR]${name ? `\x1b[33m[${name}]` : ''}\x1b[0m ${message}`);
  }
}
