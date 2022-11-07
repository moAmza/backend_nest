import {
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from '../../guards/roles.guard';
import { Role } from '../../decorators/roles.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { OutGetUserDto } from './dtos/out-get-user.dto';
import { NotFoundError } from '../../errors/not-found-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { InGetPaginatedUsers } from './dtos/in-get-paginated-users.dto';
import { OutGetPaginatedUsersDto } from './dtos/out-get-paginated-users.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TypeShortUserDto } from './dtos/type-short-user.dto';

@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('all')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all users' })
  async getPaginatedUsers(
    @Req() { userId }: { userId: string },
    @Query() input: InGetPaginatedUsers,
  ): Promise<OutGetPaginatedUsersDto> {
    const users = await this.userService.getPaginatedUsers(userId, input);
    return users;
  }

  @Get(':userId')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get single user by id' })
  @ApiNotFoundResponse({ type: NotFoundError })
  @ApiBadRequestResponse({ type: BadRequestError })
  async getUserInfo(
    @Req() { userId }: { userId: string },
    @Param('userId') paramUserId: string,
  ): Promise<OutGetUserDto> {
    const user = await this.userService.getFullUserByid(userId, paramUserId);
    if (user instanceof NotFoundError) return user.throw();
    if (user instanceof BadRequestError) return user.throw();
    return { user };
  }

  @Put('image')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'upload profile image' })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['image'],
      properties: {
        image: {
          nullable: false,
          type: 'file',
        },
      },
    },
  })
  @ApiNotFoundResponse({ type: NotFoundError })
  async uploadProfileImage(
    @Req() { userId }: { userId: string },
    @UploadedFile() image: Express.Multer.File,
  ): Promise<TypeShortUserDto> {
    const user = await this.userService.saveAndUpdateProfileImage(
      userId,
      image,
    );
    if (user instanceof NotFoundError) return user.throw();
    return user;
  }
}
