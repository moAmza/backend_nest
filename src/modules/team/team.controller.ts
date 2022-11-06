import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { RolesGuard } from '../../guards/roles.guard';
import { Role } from '../../decorators/roles.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { BadRequestError } from 'src/errors/bad-request-error';
import { NotFoundError } from 'src/errors/not-found-error';
import { OutGetTeamDto } from './dtos/out-get-team.dto';
import { InAddPlayer } from './dtos/in-add-player.dto';

@UseGuards(RolesGuard)
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get my team' })
  @ApiBadRequestResponse({ type: BadRequestError })
  @ApiNotFoundResponse({ type: NotFoundError })
  async getMyTeam(
    @Req() { userId }: { userId: string },
  ): Promise<OutGetTeamDto> {
    const team = await this.teamService.getTeamByUserId(userId);
    if (team instanceof BadRequestError) return team.throw();
    if (team instanceof NotFoundError) return team.throw();
    return { team };
  }

  @Post('player')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'add player to team' })
  @ApiBadRequestResponse({ type: BadRequestError })
  @ApiNotFoundResponse({ type: NotFoundError })
  async addPlayerToTeam(
    @Req() { userId }: { userId: string },
    @Body() body: InAddPlayer,
  ): Promise<OutGetTeamDto> {
    const team = await this.teamService.addPlayerToTeam(
      userId,
      body.player_id,
      body.position_num,
    );
    if (team instanceof BadRequestError) return team.throw();
    if (team instanceof NotFoundError) return team.throw();
    return { team };
  }

  @Delete('player')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete player from team' })
  @ApiBadRequestResponse({ type: BadRequestError })
  @ApiNotFoundResponse({ type: NotFoundError })
  async deletePlayerFromTeam(
    @Req() { userId }: { userId: string },
    @Query('position_num') position_num: number,
  ): Promise<OutGetTeamDto> {
    const team = await this.teamService.removePlayerFromTeam(
      userId,
      position_num,
    );
    if (team instanceof BadRequestError) return team.throw();
    if (team instanceof NotFoundError) return team.throw();
    return { team };
  }

  @Put('player')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'swap two players in team' })
  @ApiBadRequestResponse({ type: BadRequestError })
  @ApiNotFoundResponse({ type: NotFoundError })
  async swapPlayers(
    @Req() { userId }: { userId: string },
    @Query('position1') position1: number,
    @Query('position2') position2: number,
  ): Promise<OutGetTeamDto> {
    const team = await this.teamService.swapTeamPlayers(
      userId,
      position1,
      position2,
    );
    if (team instanceof BadRequestError) return team.throw();
    if (team instanceof NotFoundError) return team.throw();
    return { team };
  }
}
