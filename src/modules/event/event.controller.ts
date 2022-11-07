import {
  Body,
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
import { OutStatusDto } from 'src/dtos/out-status.dto';
import { InLikeEventDto } from './dtos/in-like-event.dto';

@UseGuards(RolesGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @Get()
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get events of (followers + user)' })
  async getEvents(
    @Req() { userId }: { userId: string },
    @Query() input: InGetPaginatedEvents,
  ): Promise<OutGetPaginatedEventsDto> {
    const events = await this.eventService.getEvents(
      userId,
      input.page,
      input.num,
    );
    return events;
  }

  @Post('/like')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'like an event' })
  @ApiNotFoundResponse({ type: NotFoundError })
  async likeEvent(
    @Req() { userId }: { userId: string },
    @Body() body: InLikeEventDto,
  ): Promise<OutStatusDto> {
    const like = await this.eventService.likeEvent(
      userId,
      body.weekId,
      body.userId,
    );
    return like;
  }

  @Delete('/like')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'unlike an event' })
  @ApiNotFoundResponse({ type: NotFoundError })
  async unlikeEvent(
    @Req() { userId }: { userId: string },
    @Body() body: InLikeEventDto,
  ): Promise<OutStatusDto> {
    const like = await this.eventService.dislikeEvent(
      userId,
      body.weekId,
      body.userId,
    );
    return like;
  }
}
