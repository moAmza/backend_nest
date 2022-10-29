import { InPlayerUpsertDto } from './in-player-upsert.dto';

export class InBulkUpsertPlayerDto {
  weekId: string;
  players: InPlayerUpsertDto[];
}
