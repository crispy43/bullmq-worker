export class Logger {
  name?: string;
  constructor(name?: string) {
    if (name) this.name = name;
  }
  info(message: string, jobName?: string) {
    if (!jobName) jobName = this.name;
    console.info(
      `\x1b[34m[INFO]${jobName ? `\x1b[33m[${jobName}]` : ''}\x1b[0m ${message}`,
    );
  }
  error(message: string, jobName?: string) {
    if (!jobName) jobName = this.name;
    console.error(
      `\x1b[31m[ERROR]${jobName ? `\x1b[33m[${jobName}]` : ''}\x1b[0m ${message}`,
    );
  }
  job(jobName: string) {
    return new Logger(jobName);
  }
}
