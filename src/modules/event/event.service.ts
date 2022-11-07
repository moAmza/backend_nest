import { Injectable } from '@nestjs/common';
import { EventLogRepo } from './event-log.repo';
import { WeekDao } from './daos/week.dao';
import { NotFoundError } from '../../errors/not-found-error';
import { TypeEventDto } from './dtos/type-event.dto';
import { FollowService } from '../social/social.service';
import { OutStatusDto } from 'src/dtos/out-status.dto';
import { WeekService } from '../week/week.service';
import { OutGetPaginatedEventsDto } from './dtos/out-get-paginated-events.dto';
import { OutEventDto } from './dtos/out-event.dto';
import mongoose from 'mongoose';
import { UserService } from '../user/user.service';
import { BaseError } from 'src/errors/base-error';
import { PlayerService } from '../player/player.service';
import { OutSwapLogDto } from './dtos/out-swap-log.dto';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepo: EventLogRepo,
    private readonly followService: FollowService,
    private readonly weekService: WeekService,
    private readonly userService: UserService,
    private readonly playerService: PlayerService,
  ) {}

  async createEventLog(
    userId: string,
    pastPlayerId: string,
    nextPlayerId: string,
    positionNum1: number,
    positionNum2: number,
  ): Promise<OutStatusDto | NotFoundError> {
    const week = await this.weekService.getCurrentWeek();
    if (week instanceof NotFoundError) return week;
    await this.eventRepo.createEventLog(
      userId,
      week.id,
      pastPlayerId,
      nextPlayerId,
      positionNum1,
      positionNum2,
    );
    return { status: true };
  }

  async getEvents(
    userId: string,
    page: number,
    num: number,
  ): Promise<OutGetPaginatedEventsDto | NotFoundError> {
    const followingIds = await this.followService.getAllFollowingIds(userId);
    const paginatedEvents = await this.eventRepo.getEvents(
      [...followingIds, new mongoose.Types.ObjectId(userId)],
      (page - 1) * num,
      num,
    );
    console.dir(paginatedEvents, { depth: null });

    const events: OutEventDto[] = (
      await Promise.all(
        paginatedEvents.values.map(async (event) => {
          const user = await this.userService.getShortUserByid(
            userId,
            event._id.userId.toString(),
          );
          if (user instanceof BaseError) return null;
          const week = await this.weekService.getWeekById(
            event._id.weekId.toString(),
          );
          if (week instanceof BaseError) return null;

          const outSwaps: OutSwapLogDto[] = (
            await Promise.all(
              event.swaps.map(async (swap) => {
                const player1 = await this.playerService.getPlayerByid(
                  swap.pastPlayerId.toString(),
                );
                if (player1 instanceof BaseError) return null;
                const player2 = await this.playerService.getPlayerByid(
                  swap.nextPlayerId.toString(),
                );
                if (player2 instanceof BaseError) return null;
                const outSwap: OutSwapLogDto = {
                  pastPlayer: player1,
                  nextPlayer: player2,
                  positionNum1: swap.positionNum1,
                  positionNum2: swap.positionNum2,
                };

                return outSwap;
              }),
            )
          ).reduce(
            (cur, val) => (val ? [...cur, val] : cur),
            [] as OutSwapLogDto[],
          );

          const outEvent: OutEventDto = {
            user: user,
            week: week,
            swaps: outSwaps,
          };

          return outEvent;
        }),
      )
    ).reduce((cur, val) => (val ? [...cur, val] : cur), [] as OutEventDto[]);

    return { count: paginatedEvents.count ?? 0, values: events };
  }
}
