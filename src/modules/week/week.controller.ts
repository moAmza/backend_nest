import { Controller, Get } from '@nestjs/common';
import { WeekService } from './week.service';
import { ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';
import { TypeWeekDto } from './dtos/type-week.dto';
import { OutGetWeekDto } from './dtos/out-get-week.dto';
import { NotFoundError } from '../../errors/not-found-error';

@Controller('week')
export class WeekController {
  constructor(private readonly weekService: WeekService) {}
  @Get()
  @ApiOperation({ summary: 'get current week' })
  @ApiNotFoundResponse({ type: NotFoundError })
  async getPaginatedUsers(): Promise<OutGetWeekDto> {
    const week = await this.weekService.getCurrentWeek();
    if (week instanceof NotFoundError) return week.throw();
    return { week };
  }
}
