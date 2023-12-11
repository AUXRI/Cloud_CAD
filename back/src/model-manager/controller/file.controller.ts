import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { map } from 'rxjs';
import { ObjectDto } from '../models/dto/object.dto';
import { DirectoryDto } from '../models/dto/directory.dto';
import { FileDto } from '../models/dto/file.dto';
import { FileService } from '../service/file.service';
import { createReadStream } from 'fs';
import { RenameDto } from '../models/dto/rename.dto';
import { MoveDto } from '../models/dto/move.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get('repository/:repoId')
  @ApiResponse({
    status: 200,
    description: 'Get repository by ID',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  
  getRepoById(@Param('repoId') repoId: string) {
    return this.fileService.getRepoById(repoId).pipe(
      map((repo) => {
        return repo;
      }),
    );
  }

  @Get('scan/files/:repoId')
  @ApiResponse({
    status: 200,
    description: 'Get files by repoID',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getFilesByRepoId(@Param('repoId') repoId: string) {
    return this.fileService.getFilesByRepoId(repoId);
  }

  @Get('scan/directories/:repoId')
  @ApiResponse({
    status: 200,
    description: 'Get Directories by repoID',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getDirectoriesByRepoId(@Param('repoId') repoId: string) {
    return this.fileService.getDirectoriesByRepoId(repoId);
  }

  @Get('scan/full/:repoId')
  @ApiResponse({
    status: 200,
    description: 'Get all in repository by repoID',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getAllInRepoByRepoId(@Param('repoId') repoId: string) {
    return this.fileService.getAllInRepoByRepoId(repoId);
  }

  @Get('tree/:repoId')
  @ApiResponse({
    status: 200,
    description: 'Get repository tree in JSON',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getRepoTreeInJSON(@Param('repoId') repoId: string) {
    return this.fileService.getRepoTreeInJSON(repoId);
  }

  @Get('tree')
  @ApiResponse({
    status: 200,
    description: 'Get Storage tree in JSON',
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getStorageTreeInJSON() {
    return this.fileService.getStorageTreeInJSON();
  }

  @Post('check')
  @ApiResponse({
    status: 200,
    description: 'Check if exists',
    type: ObjectDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [ObjectDto] })
  checkIfExists(@Body() objectDto: ObjectDto) {
    return this.fileService.checkIfExists(objectDto);
  }

  @Post('newdir')
  @ApiResponse({
    status: 200,
    description: 'Create Directory',
    type: DirectoryDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [DirectoryDto] })
  createDirectory(@Body() dirDto: DirectoryDto) {
    return this.fileService.createDirectory(dirDto);
  }

  @Post('rename')
  @ApiResponse({
    status: 200,
    description: 'Rename',
    type: RenameDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [RenameDto] })
  rename(@Body() renameDto: RenameDto) {
    return this.fileService.renameObject(renameDto);
  }

  @Post('move')
  @ApiResponse({
    status: 200,
    description: 'Move',
    type: MoveDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [MoveDto] })
  move(@Body() moveDto: MoveDto) {
    return this.fileService.moveObject(moveDto);
  }

  @Post('download')
  @ApiResponse({
    status: 200,
    description: 'Download',
    type: FileDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [FileDto] })
  download(@Res({ passthrough: true }) res, @Body() fileDto: FileDto) {
    const fullpath: string = this.fileService.joiner(
      fileDto.repoId,
      fileDto.path,
      fileDto.fullname,
    );
    return this.fileService.checkIfExists(fileDto).pipe(
      map((result) => {
        if (result == true) {
          const file = createReadStream(fullpath);
          res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename=${fileDto.fullname}`,
          });
          return new StreamableFile(file);
        } else {
          return `File ${join(fileDto.path, fileDto.fullname)} doesn't exists`;
        }
      }),
    );
  }

  @Post('zip')
  @ApiResponse({
    status: 200,
    description: 'Zip',
    type: DirectoryDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [DirectoryDto] })
  zip(@Res({ passthrough: true }) res, @Body() directoryDto: DirectoryDto) {
    const buffer = this.fileService.zip(directoryDto);
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=${
        (directoryDto.fullname !== '' ? directoryDto.fullname : 'root') + '.zip'
      }`,
    });
    return new StreamableFile(buffer);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
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
  @ApiBody({ type: [FileDto] })
  @ApiResponse({
    status: 200,
    description: 'Upload File',
    type: FileDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() fileDto: FileDto,
  ) {
    const filename: string = file.filename;
    return this.fileService.saveFile(filename, fileDto);
  }

  @Post('delete')
  @ApiResponse({
    status: 200,
    description: 'Delete',
    type: ObjectDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [ObjectDto] })
  delete(@Body() objectDto: ObjectDto) {
    return this.fileService.delete(objectDto).pipe(
      map((result) => {
        if (result != false) {
          console.log(`Deleted ${join(objectDto.path, objectDto.fullname)}`);
          return 'Successfuly deleted';
        } else {
          return `${join(objectDto.path, objectDto.fullname)} doesn't exists`;
        }
      }),
    );
  }
}
