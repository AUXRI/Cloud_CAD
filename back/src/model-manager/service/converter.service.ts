import { Injectable } from '@nestjs/common';
import { ManageModelDto } from '../models/dto/manageModel.dto';
// import * as nrc from 'node-run-cmd';
import { exec } from 'child_process';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { join, basename, extname } from 'path';
import { Observable, bindNodeCallback, from, map } from 'rxjs';

@Injectable()
export class ConverterService {
  DEFAULT_PATH = './buffer/';
  CONVERTER_PATH: string;

  constructor(private configService: ConfigService) {
    this.CONVERTER_PATH = this.configService.get('CONVERTER_PATH');
  }


  convertModel(filePath: string, params: ManageModelDto): Observable<string> {
    const inputPath = this.inputPath(filePath);
    const outputPath = this.outputPath(filePath, params.targetFormat);
  
    const executeCommand = bindNodeCallback(exec);
  
    const command = isNaN(params.compression)
      ? `gltf-converter ${inputPath} ${outputPath}`
      : `gltf-converter ${inputPath} ${outputPath} --draco --speed=${10 - params.compression}`;
  
    return executeCommand(command, { cwd: this.CONVERTER_PATH }).pipe(
      map(() => outputPath)
    );
  }
  // convertModel(filePath: string, params: ManageModelDto) {
  //   const inputPath = this.inputPath(filePath);
  //   const outputPath = this.outputPath(filePath, params.targetFormat);
  //   return from(
  //     isNaN(params.compression)
  //       ? nrc.run([`gltf-converter ${inputPath} ${outputPath}`], {
  //           cwd: this.CONVERTER_PATH,
  //         })
  //       : nrc.run(
  //           [
  //             `gltf-converter ${inputPath} ${outputPath} --draco --speed=${
  //               10 - params.compression
  //             }`,
  //           ],
  //           {
  //             cwd: this.CONVERTER_PATH,
  //           },
  //         ),
  //   ).pipe(
  //     map(() => {
  //       return outputPath;
  //     }),
  //   );
  // }

  compressModel(filePath: string, params: ManageModelDto) {
    const inputPath = this.inputPath(filePath);
    const outputPath = this.outputPath(filePath, params.targetFormat);
    const gltfPipeline = require('gltf-pipeline');
    const fsExtra = require('fs-extra');
    const processGltf = gltfPipeline.processGltf;
    const gltf = fsExtra.readJsonSync(inputPath);
    const options = {
      dracoOptions: {
        compressionLevel: Number(params.compression),
      },
    };
    gltf.nodes.forEach((node) => {
      node.extras = { uuid: uuidv4() };
    });
    return from(processGltf(gltf, options)).pipe(
      map((results: any) => {
        fsExtra.writeJsonSync(inputPath, results.gltf);
        return outputPath;
      }),
    );
  }

  transformGLB2GLTF(filePath: string, params: ManageModelDto) {
    const inputPath = this.inputPath(filePath);
    const outputPath = this.outputPath(filePath, params.targetFormat);
    const gltfPipeline = require('gltf-pipeline');
    const fsExtra = require('fs-extra');
    const glbToGltf = gltfPipeline.glbToGltf;
    const glb = fsExtra.readFileSync(inputPath);
    const options = {
      dracoOptions: {
        compressionLevel: Number(params.compression),
      },
    };
    return from(glbToGltf(glb, options)).pipe(
      map((results: any) => {
        results.gltf.nodes.forEach((node) => {
          node.extras = { uuid: uuidv4() };
        });
        fsExtra.writeJsonSync(outputPath, results.gltf);
        return outputPath;
      }),
    );
  }

  inputPath(filePath: string) {
    return join(this.DEFAULT_PATH, filePath);
  }

  outputPath(filePath: string, format: string) {
    return join(
      this.DEFAULT_PATH,
      basename(filePath, extname(filePath)) + '.' + format,
    );
  }

  deleteModel(path: string) {
    return from(
      fs.promises
        .rm(path, { force: true, recursive: true })
        .then(() => true)
        .catch(() => false),
    );
  }
}
