import {
  Controller,
  Get,
  Param,
  Response,
  StreamableFile,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';

@ApiTags('model')
@Controller('model')
export class ModelController {
  // Folder with test models
  private folder = 'testmodels';

  constructor() {}

  @Get('default')
  @ApiResponse({
    status: 200,
    description: 'Default model',
    type: StreamableFile,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  defaultModel(@Response({ passthrough: true }) res): StreamableFile {
    const file = createReadStream(
      join(process.cwd(), this.folder, 'defaultModel.gltf'),
    );
    return new StreamableFile(file);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get model',
    type: StreamableFile,
  })
  @ApiResponse({
    status: 204,
    description: 'No Response 204',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getModel(
    @Response({ passthrough: true }) res,
    @Param('id') id: string,
  ): StreamableFile {
    switch (id) {
      case 'valve':
        const valve = createReadStream(
          join(process.cwd(), this.folder, 'valve.gltf'),
        );
        return new StreamableFile(valve);
      case 'vice':
        const vice = createReadStream(
          join(process.cwd(), this.folder, 'vice.gltf'),
        );
        return new StreamableFile(vice);
      case 'pump':
        const pump = createReadStream(
          join(process.cwd(), this.folder, 'pump.gltf'),
        );
        return new StreamableFile(pump);
      case 'impeller':
        const impeller = createReadStream(
          join(process.cwd(), this.folder, 'impeller.gltf'),
        );
        return new StreamableFile(impeller);
      default:
        const other = createReadStream(
          join(process.cwd(), this.folder, `${id}.gltf`),
        );
        return new StreamableFile(other);
    }
  }
}
