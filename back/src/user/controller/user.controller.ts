import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { map, Observable, switchMap } from 'rxjs';
import { Response } from 'express';
import { SessionI } from 'src/auth/models/interfaces/session.interface';
import { CreateUserDto } from '../models/dto/CreateUser.dto';
import { LoginUserDto } from '../models/dto/LoginUser.dto';
import { UserService } from '../service/user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDocument } from '../models/schemas/user.schema';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'Create user',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [CreateUserDto] })
  create(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
    return this.userService.create(createUserDto).pipe(
      switchMap(() => {
        return this.login(
          {
            ...LoginUserDto,
            login: createUserDto.login,
            password: createUserDto.password,
          },
          response,
        );
      }),
    );
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Create login',
    type: LoginUserDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [LoginUserDto] })
  login(@Body() loginUserDto: LoginUserDto, @Res() response: Response) {
    return this.userService.login(loginUserDto).pipe(
      map((session: SessionI) => {
        response.cookie('access_token', session.access_token, {
          expires: new Date(Date.now() + 1000 * 60 * 5),
          httpOnly: true,
          secure: false,
        });
        response.cookie('refresh_token', session.refresh_token.token, {
          expires: session.refresh_token.expireDate,
          httpOnly: true,
          secure: false,
        });
        return response.status(HttpStatus.ACCEPTED).send(session.user);
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @ApiResponse({
    status: 200,
    description: 'logout',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  logout(@Res() response) {
    response.clearCookie('refresh_token');
    response.clearCookie('access_token');
    return response.status(200).json('User Logged out');
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Update User',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @Post('update')
  // @ApiBody({ type: [UserDocument] })
  updateUser(@Body() updateUserDto: UserDocument) {
    return this.userService.updateOne(updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get current user',
    type: Observable<UserDocument>,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getCurUser(@Req() req): Observable<UserDocument> {
    return this.userService.findOne({ userId: req.user._id });
  }

  @UseGuards(JwtAuthGuard)
  @Get('is_auth')
  @ApiResponse({
    status: 200,
    description: 'Check short',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  check(@Req() request) {
    if (request.user !== null) return true;
  }

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'Get all users',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getAllUsers() {
    return this.userService.findAll();
  }
}
