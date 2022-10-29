import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PlayerService } from './player.service';
import { RolesGuard } from '../../guards/roles.guard';
import { Role } from '../../decorators/roles.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { OutGetPlayerDto } from './dtos/out-get-player.dto';
import { NotFoundError } from 'src/errors/not-found-error';
import { BadRequestError } from 'src/errors/bad-request-error';
import { InGetPaginatedPlayers } from './dtos/in-get-paginated-players.dto';
import { OutGetPaginatedPlayersDto } from './dtos/out-get-paginated-players.dto';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}
  @Get('all')
  @ApiOperation({ summary: 'get all players' })
  @ApiBadRequestResponse({ type: BadRequestError })
  async getPaginatedUsers(
    @Query() input: InGetPaginatedPlayers,
  ): Promise<OutGetPaginatedPlayersDto> {
    const players = await this.playerService.getPaginatedPlayers(input);
    if (players instanceof NotFoundError) return players.throw();
    return players;
  }

  @Get(':playerId')
  @ApiOperation({ summary: 'get single player by id' })
  @ApiNotFoundResponse({ type: NotFoundError })
  @ApiBadRequestResponse({ type: BadRequestError })
  async getUserInfo(
    @Param('playerId') playerId: string,
  ): Promise<OutGetPlayerDto> {
    const player = await this.playerService.getPlayerByid(playerId);
    if (player instanceof NotFoundError) return player.throw();
    if (player instanceof BadRequestError) return player.throw();
    return { player };
  }
}
