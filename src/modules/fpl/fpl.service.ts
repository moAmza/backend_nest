import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BaseError } from 'src/errors/base-error';
import { NetworkError } from 'src/errors/network-error';
import { NotFoundError } from 'src/errors/not-found-error';
import { PlayerService } from '../player/player.service';
import { WeekService } from '../week/week.service';
import { FplDao } from './daos/fpl.dao';
import { OutFplUpdatedDto } from './dtos/out-fpl-updated.dto';
import { TypeFplPlayerDto } from './dtos/type-fpl-player.dto';
import { TypeFplTransformedDataDto } from './dtos/type-fpl-transformed-data.dto';
import { TypeFplWeekDto } from './dtos/type-fpl-week.dto';
import { FplRepo } from './fpl.repo';

@Injectable()
export class FplService {
  constructor(
    private readonly fplRepo: FplRepo,
    private readonly playerService: PlayerService,
    private readonly weekService: WeekService,
  ) {}

  private async getFplInfo(): Promise<
    NetworkError | TypeFplTransformedDataDto
  > {
    const fplResponse = await this.fplRepo.getBootstrap();
    if (fplResponse instanceof NetworkError) return fplResponse;
    const players = FplDao.transformBootstrapToPlayer(fplResponse);
    const weeks = FplDao.transformBootstrapToWeek(fplResponse);
    return { players, weeks };
  }

  private async updateFplPlayers(
    weekId: string,
    players: TypeFplPlayerDto[],
  ): Promise<boolean> {
    return await this.playerService
      .bulkUpsertPlayers({ weekId, players })
      .then(() => true)
      .catch(() => false);
  }

  private async updateFplWeeks(weeks: TypeFplWeekDto[]): Promise<boolean> {
    return await this.weekService
      .buildUpsertWeeks(weeks)
      .then(() => true)
      .catch(() => false);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async updateFplCronJob() {
    console.log('crone job started');
    await this.updateFpl()
      .then((res) => {
        if (res instanceof BaseError)
          console.log(res.errorType, ': ', res.message);
        else console.log('crone job ended succesfully');
      })
      .catch(async (e) => console.log(e));
  }

  async updateFpl(): Promise<NetworkError | NotFoundError | OutFplUpdatedDto> {
    const fplInfo = await this.getFplInfo();
    if (fplInfo instanceof NetworkError) return fplInfo;
    if (!(await this.updateFplWeeks(fplInfo.weeks)))
      return new NetworkError('weeks were not updated.');
    console.log('Weeks updated.');
    const cuerrentWeek = await this.weekService.getCurrentWeek();
    if (cuerrentWeek instanceof NotFoundError) return cuerrentWeek;
    if (!(await this.updateFplPlayers(cuerrentWeek.id, fplInfo.players)))
      return new NetworkError('players were not updated.');
    console.log('Players updated.');
    return { status: true };
  }
}
