import * as Handlebars from 'handlebars';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as fs from 'fs';

export abstract class HandlebarsUserData extends ec2.UserData {

  /**
   * Create a userdata object for Linux hosts
   */
  public static forLinux(options: HandlebarsLinuxUserDataOptions = {}): HandlebarsLinuxUserData {
    return new HandlebarsLinuxUserData(options);
  }

  /**
   * Create a userdata object for Windows hosts
   */
  public static forWindows(): HandlebarsWindowsUserData {
    return new HandlebarsWindowsUserData();
  }

}

export interface HandlebarsLinuxUserDataOptions {
  /**
   * Shebang for the UserData script
   *
   * @default "#!/bin/bash"
   */
  readonly shebang?: string;
}

export class HandlebarsLinuxUserData extends ec2.UserData {

  private readonly lines: string[] = [];

  private file: string = '';

  private data: any = {};

  constructor(private readonly props: HandlebarsLinuxUserDataOptions = {}) {
    super();
  }

  public addCommands(...commands: string[]) {
    this.lines.push(...commands);
  }

  public addData(key: string, value: any) {
    this.data[key] = value;
  }

  public addTemplateFile(path : string) {
    this.file = fs.readFileSync(path, 'utf8');
  }

  public render(): string {
    const shebang = this.props.shebang !== undefined ? this.props.shebang : '#!/bin/bash';
    const template = Handlebars.compile(this.file)(this.data);
    return [shebang, template, ...this.lines].join('\n');
  }

}

export class HandlebarsWindowsUserData extends ec2.UserData {

  private readonly lines: string[] = [];

  private file: string = '';

  private data: any = {};

  public addCommands(...commands: string[]) {
    this.lines.push(...commands);
  }

  public addData(key: string, value: any) {
    this.data[key] = value;
  }

  public addTemplateFile(path : string) {
    this.file = fs.readFileSync(path, 'utf8');
  }

  public render(): string {
    const template = Handlebars.compile(this.file)(this.data);
    const lines = this.lines.join('\n');
    const content = [template, lines].join('\n');
    return `<powershell>${content}</powershell>`;
  }

}
