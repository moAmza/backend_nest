import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { NotFoundError } from '../../errors/not-found-error';
import { Role } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { OutGetPaginatedEventsDto } from './dtos/out-get-paginated-events.dto';
import { InGetPaginatedEvents } from './dtos/in-get-paginated-events.dto';

@UseGuards(RolesGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @Get()
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get events' })
  @ApiNotFoundResponse({ type: NotFoundError })
  async getEvents(
    @Req() { userId }: { userId: string },
    @Query() input: InGetPaginatedEvents,
  ): Promise<OutGetPaginatedEventsDto> {
    console.log(userId);

    const week = await this.eventService.getEvents(
      userId,
      input.page,
      input.num,
    );
    if (week instanceof NotFoundError) return week.throw();
    return week;
  }

  @Post('/like')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'like an event' })
  @ApiNotFoundResponse({ type: NotFoundError })
  async likeEvent(@Req() { userId }: { userId: string }): Promise<{}> {
    // const week = await this.eventService.getEvents(userId);
    // if (week instanceof NotFoundError) return week.throw();
    return {};
  }

  @Delete('/like')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'unlike an event' })
  @ApiNotFoundResponse({ type: NotFoundError })
  async unlikeEvent(@Req() { userId }: { userId: string }): Promise<{}> {
    // const week = await this.eventService.getEvents(userId);
    // if (week instanceof NotFoundError) return week.throw();
    return {};
  }
}
