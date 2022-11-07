import { Injectable } from '@nestjs/common';
import { WeekRepo } from './week.repo';
import { OutGetWeekDto } from './dtos/out-get-week.dto';
import { WeekDao } from './daos/week.dao';
import { NotFoundError } from '../../errors/not-found-error';
import { InWeekUpsertDto } from './dtos/in-week-upsert.dto';
import { TypeWeekDto } from './dtos/type-week.dto';

@Injectable()
export class WeekService {
  constructor(private readonly weekRepo: WeekRepo) {}

  async buildUpsertWeeks(weeks: InWeekUpsertDto[]): Promise<TypeWeekDto[]> {
    return await Promise.all(
      weeks.map(async (week) => {
        const weekSchema = WeekDao.transformInWeekUpsertToWeekSchema(week);
        const weekModel = await this.weekRepo.upsertOne(weekSchema);

        return WeekDao.convertOne(weekModel);
      }),
    );
  }

  async getCurrentWeek(): Promise<TypeWeekDto | NotFoundError> {
    const weekModel = await this.weekRepo.getCurrentWeek();
    if (!weekModel) return new NotFoundError('Week');
    const week = WeekDao.convertOne(weekModel);

    return week;
  }

  async getWeekById(id: string): Promise<TypeWeekDto | NotFoundError> {
    const weekModel = await this.weekRepo.getWeekById(id);
    if (!weekModel) return new NotFoundError('Week');
    const week = WeekDao.convertOne(weekModel);

    return week;
  }
}
