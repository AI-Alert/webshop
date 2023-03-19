import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserEntity } from '@src/entities';
import { JwtAuthUserGuardRedis } from '@src/auth/guards';
import { UserProfileService } from '@src/user/profile/services';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
export const EXAMPLE_USER = {
  id: '123',
  photoUrl:
    'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg',
  name: 'Tom Sample Org.',
  description: 'Tom sample description',
  contactName: 'Tom',
  email: 'tom@sample.com',
  phoneNumber: '1234567890',
  address: 'Fake str. 17',
  websiteUrl: 'https://tom-sample.com',
  category: {},
  sustainableGoals: [],
  status: 'active',
  verification: {},
  opportunities: [],
};

@ApiTags('User Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthUserGuardRedis)
@Controller('user/profile')
export class UserProfileController {
  constructor(private readonly _userProfileService: UserProfileService) {}
  @Get()
  @ApiOperation({ summary: "Find currently logged in organisation's details" })
  @ApiOkResponse({
    description: 'Returns the organisation',
    content: {
      'application/json': {
        example: EXAMPLE_USER,
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async getProfileInfo(@Req() req): Promise<UserEntity> {
    const userId = req.user.id;
    return this._userProfileService.findProfileDetails(userId);
  }
  @Patch()
  @ApiOperation({
    summary: "Edit the currently logged in organisation's details",
  })
  @ApiOkResponse({
    description: 'Returns the organisation before or after update',
    content: {
      'application/json': {
        example: EXAMPLE_USER,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Returns when a field has failed validation',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: ['email must be a valid email string'],
          error: 'Bad Request',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async editProfileInfo(@Req() req, @Body() dto): Promise<Partial<UserEntity>> {
    const userId = req.user.id;
    return this._userProfileService.editProfileDetails(userId, dto);
  }
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new Error('Only .jpg, .jpeg and .png files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      originalName: file.originalname,
      url: `../uploads/profile-photos/${file.filename}`,
    };
  }
}
