import { Inject, Injectable } from '@nestjs/common';
import { SwapLogRepo } from './swap-log.repo';
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
import { LikeEventRepo } from './like-event.repo';
import { TypeSwapLogDto } from './dtos/type-swap-log.dto';

@Injectable()
export class EventService {
  constructor(
    private readonly swapLogRepo: SwapLogRepo,
    private readonly likeEventRepo: LikeEventRepo,
    private readonly followService: FollowService,
    private readonly weekService: WeekService,
    private readonly userService: UserService,
    private readonly ps: PlayerService,
  ) {}

  async createSwapLog(
    userId: string,
    pastPlayerId: string,
    nextPlayerId: string,
    positionNum1: number,
    positionNum2: number,
  ): Promise<OutStatusDto | NotFoundError> {
    const week = await this.weekService.getCurrentWeek();
    if (week instanceof NotFoundError) return week;
    await this.swapLogRepo.createSwapLog(
      userId,
      week.id,
      pastPlayerId,
      nextPlayerId,
      positionNum1,
      positionNum2,
    );
    return { status: true };
  }

  private async getOutSwapLog(
    swap: TypeSwapLogDto,
  ): Promise<OutSwapLogDto | null> {
    const player1 = await this.ps.getPlayerByid(swap.pastPlayerId.toString());
    if (player1 instanceof BaseError) return null;
    const player2 = await this.ps.getPlayerByid(swap.nextPlayerId.toString());
    if (player2 instanceof BaseError) return null;
    const outSwap: OutSwapLogDto = {
      pastPlayer: player1,
      nextPlayer: player2,
      positionNum1: swap.positionNum1,
      positionNum2: swap.positionNum2,
    };

    return outSwap;
  }

  async getEvents(
    userId: string,
    page: number,
    num: number,
  ): Promise<OutGetPaginatedEventsDto> {
    const followingIds = await this.followService.getAllFollowingIds(userId);
    const paginatedEvents = await this.swapLogRepo.getEvents(
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
            await Promise.all(event.swaps.map((s) => this.getOutSwapLog(s)))
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

  async likeEvent(
    userId: string,
    weekId: string,
    userEventId: string,
  ): Promise<OutStatusDto> {
    await this.likeEventRepo.createLikeEvent(userId, weekId, userEventId);
    return { status: true };
  }

  async dislikeEvent(
    userId: string,
    weekId: string,
    userEventId: string,
  ): Promise<OutStatusDto> {
    const like = await this.likeEventRepo.removeLikeEvent(
      userId,
      weekId,
      userEventId,
    );
    return { status: like !== null };
  }
}
