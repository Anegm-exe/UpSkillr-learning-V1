import { FileVersion } from "src/schemas/content.schema";

export class UpdateContentDto {
  readonly title?: string;
  readonly url?: string;
  readonly desc?: string;
  readonly currentVersion?: number;
  readonly versions?: FileVersion[];
}
