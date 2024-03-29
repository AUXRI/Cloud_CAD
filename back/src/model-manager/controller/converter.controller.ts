import {
  Body,
  Controller,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { map, Observable } from 'rxjs';
import { ManageModelDto } from '../models/dto/manageModel.dto';
import { ConverterService } from '../service/converter.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('converter')
@Controller('converter')
export class ConverterController {
  constructor(private converterService: ConverterService) {}
  @Post()
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
  @ApiResponse({
    status: 200,
    description: 'Process And Send Model',
    type: ManageModelDto,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: [ManageModelDto] })
  processAndSendModel(
    @UploadedFile() file: Express.Multer.File,
    @Body() manageModelDto: ManageModelDto,
  ): Observable<StreamableFile> {
    switch (extname(file.originalname).toLowerCase()) {
      case '.gltf':
        return this.converterService
          .compressModel(file.filename, manageModelDto)
          .pipe(
            map((path) => {
              const model = createReadStream(join(process.cwd(), path));
              return new StreamableFile(model);
            }),
          );
      case '.glb':
        return this.converterService
          .transformGLB2GLTF(file.filename, manageModelDto)
          .pipe(
            map((path) => {
              const model = createReadStream(join(process.cwd(), path));
              return new StreamableFile(model);
            }),
          );
      default:
        return this.converterService
          .convertModel(file.filename, manageModelDto)
          .pipe(
            map((path) => {
              const model = createReadStream(join(process.cwd(), path));
              return new StreamableFile(model);
            }),
          );
    }
  }
}
