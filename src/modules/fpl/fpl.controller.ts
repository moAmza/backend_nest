import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FplService } from './fpl.service';
import { RolesGuard } from '../../guards/roles.guard';
import { Role } from '../../decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OutFplUpdatedDto } from './dtos/out-fpl-updated.dto';

@UseGuards(RolesGuard)
@Controller('fpl')
export class FplController {
  constructor(private readonly fplService: FplService) {}
  @Get('update')
  // @Role('ADMIN')
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'update fpl information' })
  async updateFpl(): Promise<OutFplUpdatedDto> {
    const res = await this.fplService.updateFpl();
    return { status: true };
  }
}
