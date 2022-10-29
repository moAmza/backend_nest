import { InWeekUpsertDto } from '../dtos/in-week-upsert.dto';
import { TypeWeekDto } from '../dtos/type-week.dto';
import { Week } from '../week.schema';

export abstract class WeekDao {
  static convertOne = (model: MongoDoc<Week>): TypeWeekDto => ({
    id: model._id.toString(),
    refId: model.refId,
    weekNum: model.weekNum,
    endDate: model.endDate,
    deadlineDate: model.deadlineDate,
    isCurrent: model.isCurrent,
    isNext: model.isNext,
    isPrevious: model.isPrevious,
  });

  static transformInWeekUpsertToWeekSchema(input: InWeekUpsertDto): Week {
    return {
      refId: input.refId,
      weekNum: input.weekNum,
      endDate: input.endDate,
      deadlineDate: input.deadlineDate,
      isCurrent: input.isCurrent,
      isNext: input.isNext,
      isPrevious: input.isPrevious,
      createdAt: new Date(),
    };
  }
}
