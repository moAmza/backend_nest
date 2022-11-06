import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FollowService } from './social.service';
import { RolesGuard } from '../../guards/roles.guard';
import { Role } from '../../decorators/roles.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { NotFoundError } from 'src/errors/not-found-error';
import { BadRequestError } from 'src/errors/bad-request-error';
import { OutStatusDto } from 'src/dtos/out-status.dto';
import { InGetPaginatedFollow } from './dtos/in-get-paginated-follows.dto';
import { OutGetPaginatedFollowsDto } from './dtos/out-get-paginated-follows.dto';

@UseGuards(RolesGuard)
@Controller('social')
export class SocialController {
  constructor(private readonly userService: FollowService) {}

  @Post('follow/:followingId')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'follow user' })
  @ApiBadRequestResponse({ type: BadRequestError })
  @ApiNotFoundResponse({ type: NotFoundError })
  async followUser(
    @Param('followingId') followingId: string,
    @Req() { userId }: { userId: string },
  ): Promise<OutStatusDto> {
    console.log(followingId);

    const status = await this.userService.follow(userId, followingId);
    if (status instanceof NotFoundError) return status.throw();
    if (status instanceof BadRequestError) return status.throw();
    return { status };
  }

  @Delete('unfollow/:followingId')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'unfollow user' })
  @ApiBadRequestResponse({ type: BadRequestError })
  @ApiNotFoundResponse({ type: NotFoundError })
  async unFollowUser(
    @Param('followingId') followingId: string,
    @Req() { userId }: { userId: string },
  ): Promise<OutStatusDto> {
    const status = await this.userService.unfollow(userId, followingId);
    if (status instanceof NotFoundError) return status.throw();
    if (status instanceof BadRequestError) return status.throw();
    return { status };
  }

  @Get('followers')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get followers in paginated form' })
  @ApiBadRequestResponse({ type: BadRequestError })
  @ApiNotFoundResponse({ type: NotFoundError })
  async getPaginatedFollowers(
    @Req() { userId }: { userId: string },
    @Query() input: InGetPaginatedFollow,
  ): Promise<OutGetPaginatedFollowsDto> {
    const status = await this.userService.getPaginatedFollowers(userId, input);
    if (status instanceof NotFoundError) return status.throw();
    if (status instanceof BadRequestError) return status.throw();
    return status;
  }

  @Get('followings')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get followings in paginated form' })
  @ApiBadRequestResponse({ type: BadRequestError })
  @ApiNotFoundResponse({ type: NotFoundError })
  async getPaginatedFollowings(
    @Req() { userId }: { userId: string },
    @Query() input: InGetPaginatedFollow,
  ): Promise<OutGetPaginatedFollowsDto> {
    const status = await this.userService.getPaginatedFollowings(userId, input);
    if (status instanceof NotFoundError) return status.throw();
    if (status instanceof BadRequestError) return status.throw();
    return status;
  }
}
