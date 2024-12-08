import { FileVersion } from "src/content/model/Content.schema";

export class UpdateContentDto {
  readonly title?: string;
  readonly url?: string;
  readonly desc?: string;
  readonly currentVersion?: number;
  readonly versions?: FileVersion[];
}
