import { FileVersion } from "src/schemas/content.schema";

export class CreateContentDto {
  readonly title: string;
  readonly url?: string;
  readonly file?: File;
  readonly desc: string;
  readonly currentVersion?: number;
  readonly versions?: FileVersion[];
}
