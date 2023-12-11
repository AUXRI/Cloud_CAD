import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Response,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, existsSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { map, Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AddParticipantDto } from 'src/team/models/dto/addParticipant.dto';
import { RemoveParticipantDto } from 'src/team/models/dto/removeParticipant.dto';
import { UpdateParticipantDto } from 'src/team/models/dto/updateParticipant.dto';
import { UserDocument } from 'src/user/models/schemas/user.schema';
import { AddToFavoriteDto } from '../models/dto/addToFavorite.dto';
import { CheckRepoInFavoriteDto } from '../models/dto/checkRepoInFavorite.dto';
import { CreateRepositoryDto } from '../models/dto/createRepository.dto';
import { FindRepositoryDto } from '../models/dto/findRepository.dto';
import { RegisterModelDto } from '../models/dto/registerModel.dto';
import { RemoveFromFavoriteDto } from '../models/dto/removeFromFavorite.dto';
import { RemoveModelDto } from '../models/dto/removeModel.dto';
import { TakeModelDto } from '../models/dto/takeModel.dto';
import { RepositoryDocument } from '../models/schemas/repository.schema';
import { RepositoryService } from '../service/repository.service';
import { ApiBody, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('repository')
@Controller('repository')
export class RepositoryController {
  constructor(private repositoryService: RepositoryService) {}
  

  @Post('create')
  @ApiResponse({
    status: 200,
    description: 'Create repository',
    type: CreateRepositoryDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [CreateRepositoryDto] })
  createRepository(
    @Body() createRepoDto: CreateRepositoryDto,
  ): Observable<RepositoryDocument> {
    return this.repositoryService.create(createRepoDto);
  }

  @Post('update')
  @ApiResponse({
    status: 200,
    description: 'Update repository',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  updateRepository(
    @Body() repositoryData: RepositoryDocument,
  ): Observable<boolean> {
    return this.repositoryService.updateOne(repositoryData);
  }

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'Get all repositories',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getAllRepos() {
    return this.repositoryService.getAll();
  }

  @Get('all-public')
  @ApiResponse({
    status: 200,
    description: 'Get all public repos',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getAllPublicRepos() {
    return this.repositoryService.getAllPublic();
  }

  @Get('one/:id')
  @ApiResponse({
    status: 200,
    description: 'Get repo by ID',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getRepositoryById(@Param('id') id: string): Observable<RepositoryDocument> {
    return this.repositoryService.getOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  @ApiResponse({
    status: 200,
    description: 'Get repo by user',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getReposByUser(@Param('id') id: string): Observable<RepositoryDocument[]> {
    return this.repositoryService.getUserRepos(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('team/:id')
  @ApiResponse({
    status: 200,
    description: 'Get repo by team',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getReposByTeam(
    @Param('id') id: string,
    @Req() req,
  ): Observable<RepositoryDocument[]> {
    return this.repositoryService.getTeamRepos(id, req.user._id);
  }

  @Get('team-public/:id')
  @ApiResponse({
    status: 200,
    description: 'Get public repos by team',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getPublicReposByTeam(
    @Param('id') id: string,
  ): Observable<RepositoryDocument[]> {
    return this.repositoryService.getPublicTeamRepos(id);
  }

  @Post('participant/add')
  @ApiResponse({
    status: 200,
    description: 'Add Participant To The Repository',
    type:AddParticipantDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [AddParticipantDto] })
  addParticipantToTheRepository(
    @Body() participantDto: AddParticipantDto,
  ): Observable<UserDocument | boolean> {
    return this.repositoryService.addParticipant(participantDto);
  }

  @Post('participant/remove')
  @ApiResponse({
    status: 200,
    description: 'Remove Participant From The Repository',
    type: RemoveParticipantDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [RemoveParticipantDto] })
  removeParticipantFromTheRepository(
    @Body() removeParticipantDto: RemoveParticipantDto,
  ): Observable<boolean> {
    return this.repositoryService.removeParticipant(removeParticipantDto);
  }

  @Post('participant/update')
  @ApiResponse({
    status: 200,
    description: 'Update Participant Of The Repository',
    type: UpdateParticipantDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [UpdateParticipantDto] })
  updateParticipantOfTheRepository(
    @Body() updateParticipantDto: UpdateParticipantDto,
  ): Observable<boolean> {
    return this.repositoryService.updateParticipant(updateParticipantDto);
  }

  @Get('delete-all')
  @ApiResponse({
    status: 200,
    description: 'Delete all',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  deleteAll(): Observable<boolean> {
    return this.repositoryService.deleteAll();
  }

  @Get('delete/:id')
  @ApiResponse({
    status: 200,
    description: 'Delete one',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  deleteOne(@Param('id') id: string): Observable<boolean> {
    return this.repositoryService.deleteOne(id);
  }

  @Post('model/add')
  @UseInterceptors(
    FileInterceptor('model', {
      storage: diskStorage({
        destination: './buffer/',
        filename: (req, file, cb) => {
          const randomName =
            Array(8)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('') + extname(file.originalname);
          return cb(null, randomName);
        },
      }),
    }),
  )
  @ApiBody({ type: [RegisterModelDto] })
  @ApiResponse({
    status: 200,
    description: 'Register model',
    type: RegisterModelDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  registerModel(
    @UploadedFile() file: Express.Multer.File,
    @Body() registerModelDto: RegisterModelDto,
  ) {
    return this.repositoryService.registerModel(file, registerModelDto);
  }

  @Post('model/remove')
  @ApiResponse({
    status: 200,
    description: 'Remove Model',
    type: RemoveModelDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [RemoveModelDto] })
  removeModel(@Body() removeModelDto: RemoveModelDto) {
    return this.repositoryService.removeModel(removeModelDto);
  }

  @Post('model/take')
  @ApiResponse({
    status: 200,
    description: 'Take model',
    type: TakeModelDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [TakeModelDto] })
  takeModel(
    @Body() takeModelDto: TakeModelDto,
    @Response({ passthrough: true }) res,
  ): Observable<string> {
    return this.repositoryService.takeModel(takeModelDto).pipe(
      map((model: any) => {
        const gltfData = JSON.parse(model.gltf);
        if (!gltfData) {
          throw new HttpException(
            'Модель репозитория не найдена',
            HttpStatus.NOT_FOUND,
          );
        }
        return gltfData;
      })
    );
  }

  @Post('favorite/add')
  @ApiResponse({
    status: 200,
    description: 'Add repository to favorite',
    type: AddToFavoriteDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [AddToFavoriteDto] })
  addRepositoryToFavorite(@Body() addToFavoriteDto: AddToFavoriteDto) {
    return this.repositoryService.addRepoToFavorite(addToFavoriteDto);
  }

  @Post('favorite/check')
  @ApiResponse({
    status: 200,
    description: 'Check Repository In Favorite',
    type: CheckRepoInFavoriteDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [CheckRepoInFavoriteDto] })
  checkRepositoryInFavorite(
    @Body() checkRepoInFavoriteDto: CheckRepoInFavoriteDto,
  ) {
    return this.repositoryService.checkFavorite(checkRepoInFavoriteDto);
  }

  @Post('favorite/remove')
  @ApiResponse({
    status: 200,
    description: 'Remove Repository To Favorite',
    type: RemoveFromFavoriteDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [RemoveFromFavoriteDto] })
  removeRepositoryToFavorite(
    @Body() removeFromFavoriteDto: RemoveFromFavoriteDto,
  ) {
    return this.repositoryService.removeRepoFromFavorite(removeFromFavoriteDto);
  }

  @Get('favorite/user/:id')
  @ApiResponse({
    status: 200,
    description: 'Get User Favorites',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getUserFavorites(@Param('id') id: string) {
    return this.repositoryService.getUserFavoriteReps(id);
  }

  @Post('search')
  @ApiResponse({
    status: 200,
    description: 'Search Repository By Query',
    type: FindRepositoryDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [FindRepositoryDto] })
  searchRepositoryByQuery(@Body() findRepositoryDto: FindRepositoryDto) {
    return this.repositoryService.searchRepositoryByQuery(findRepositoryDto);
  }

  @Get('favorite/all')
  @ApiResponse({
    status: 200,
    description: 'Get All Favorite Tickets',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getAllFavoriteTickets() {
    return this.repositoryService.getAllFavoriteTickets();
  }
}
