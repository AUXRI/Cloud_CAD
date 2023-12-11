import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserEntryDto } from 'src/user/models/dto/userEntry.dto';
import { UserDocument } from 'src/user/models/schemas/user.schema';
import { AddParticipantDto } from '../models/dto/addParticipant.dto';
import { CreateTeamDto } from '../models/dto/CreateTeam.dto';
import { RemoveParticipantDto } from '../models/dto/removeParticipant.dto';
import { UpdateParticipantDto } from '../models/dto/updateParticipant.dto';
import { TeamDocument } from '../models/schemas/team.schema';
import { TeamService } from '../service/team.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('team')
@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Post('create')
  @ApiResponse({
    status: 200,
    description: 'Create Team',
    type: CreateTeamDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [CreateTeamDto] })
  createTeam(@Body() createTeamDto: CreateTeamDto): Observable<TeamDocument> {
    return this.teamService.createOne(createTeamDto);
  }

  @Post('update')
  @ApiResponse({
    status: 200,
    description: 'Update Team',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  updateTeam(@Body() teamData: TeamDocument): Observable<boolean> {
    return this.teamService.updateOne(teamData);
  }

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'Get all teams',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getAllTeams() {
    return this.teamService.getAll();
  }

  @Get('one/:id')
  @ApiResponse({
    status: 200,
    description: 'Get team by ID',
    type: Observable<TeamDocument>,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getTeamById(@Param('id') id: string): Observable<TeamDocument> {
    return this.teamService.getOneById(id);
  }

  @Post('user')
  @ApiResponse({
    status: 200,
    description: 'Get teams by user',
    type: UserEntryDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [UserEntryDto] })
  getTeamsByUser(
    @Body() userEntryDto: UserEntryDto,
  ): Observable<TeamDocument[]> {
    return this.teamService.getManyByUser(userEntryDto);
  }

  @Post('participant/add')
  @ApiResponse({
    status: 200,
    description: 'Add Participant To The Team',
    type: AddParticipantDto,
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
  addParticipantToTheTeam(
    @Body() participantDto: AddParticipantDto,
  ): Observable<UserDocument | boolean> {
    return this.teamService.addParticipant(participantDto);
  }

  @Post('participant/remove')
  @ApiResponse({
    status: 200,
    description: 'Remove Participant From The Team',
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
  removeParticipantFromTheTeam(
    @Body() removeParticipantDto: RemoveParticipantDto,
  ): Observable<boolean> {
    return this.teamService.removeParticipant(removeParticipantDto);
  }

  @Post('participant/update')
  @ApiResponse({
    status: 200,
    description: 'Update Participant Of The Team',
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
  updateParticipantOfTheTeam(
    @Body() updateParticipantDto: UpdateParticipantDto,
  ): Observable<boolean> {
    return this.teamService.updateParticipant(updateParticipantDto);
  }

  @Post('check-title')
  @ApiResponse({
    status: 200,
    description: 'Check If Team Title Is Free',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  checkIfTeamTitleIsFree(@Body() data: { title: string }): Observable<boolean> {
    return this.teamService.checkIfTeamTitleIsFree(data.title);
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
    return this.teamService.deleteOne(id);
  }
}
