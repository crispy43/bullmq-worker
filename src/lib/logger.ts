export class Logger {
  name?: string;
  prefix?: string;
  suffix?: string;

  constructor(name?: string, prefix?: string, suffix?: string) {
    if (name) this.name = name;
    if (prefix) this.prefix = prefix;
    if (suffix) this.suffix = suffix;
  }

  private format(
    level: 'INFO' | 'ERROR',
    color: string,
    message: string,
    jobName?: string,
  ): string {
    const namePart = jobName || this.name;
    const prefixPart = this.prefix ? `${this.prefix}` : '';
    const suffixPart = this.suffix ? ` ${this.suffix}` : '';
    return `${color}[${level}]${
      namePart ? `\x1b[33m[${namePart}]` : ''
    }\x1b[0m ${prefixPart}${message}${suffixPart}`;
  }

  info(message: string, jobName?: string) {
    console.info(this.format('INFO', '\x1b[34m', message, jobName));
  }

  error(message: string, jobName?: string) {
    console.error(this.format('ERROR', '\x1b[31m', message, jobName));
  }

  job(jobName: string, inheritPrefixSuffix = false) {
    const logger = new Logger(jobName);
    if (inheritPrefixSuffix) {
      logger.prefix = this.prefix;
      logger.suffix = this.suffix;
    }
    return logger;
  }

  setPrefix(prefix: string) {
    this.prefix = prefix;
    return this;
  }

  setSuffix(suffix: string) {
    this.suffix = suffix;
    return this;
  }
}
