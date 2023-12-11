import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { from, Observable, of, switchMap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { processGltf, glbToGltf } from 'gltf-pipeline';
import { exec } from 'child_process';

@Injectable()
export class ModelService {
  CONVERTER_PATH: string;

  constructor(private configService: ConfigService) {
    this.CONVERTER_PATH = this.configService.get('CONVERTER_PATH');
  }

  convertModelAndSave(
    inputPath: string,
    outputPath: string,
    straightPath: string,
    compression: number,
  ) {
    return from(
      new Promise((resolve, reject) => {
        exec(
          `gltf-converter ${inputPath} ${outputPath} --draco --speed=${10 - compression}`,
          {
            cwd: this.CONVERTER_PATH,
          },
          (err) => {
            if (!err) {
              resolve(true);
            } else {
              reject(false);
            }
          }
        )
      }).then((result) => {
        return result ? true : false;
      })
    ).pipe(
      switchMap((res) => {
        if (!res) {
          return of(false);
        }

        // Saving original model
        return this.saveModel(inputPath, straightPath);
      }),
    );
  }

  saveModel(inputPath: string, outputPath: string) {
    return from(
      fs.promises
        .rename(inputPath, outputPath)
        .then(() => true)
        .catch(() => false),
    );
  }

  compressModelAndSave(originalPath, outputPath: string) {
    return this.readJSON(originalPath).pipe(
      switchMap((gltf: any) => {
        const options = {
          dracoOptions: {
            compressionLevel: 10,
          },
        };
        gltf.nodes.forEach((node) => {
          node.extras = { uuid: uuidv4() };
        });
        return from(processGltf(gltf, options)).pipe(
          switchMap((results: any) => {
            return this.writeJSON(outputPath, results.gltf);
          }),
        );
      })
    );
  }

  transformGLB2GLTFAndSave(originalPath, outputPath) {
    return this.readFile(originalPath).pipe(
      switchMap((glb: any) => {
        const options = {
          dracoOptions: {
            compressionLevel: 10,
          },
        };
        return from(glbToGltf(glb, options)).pipe(
          switchMap((results: any) => {
            results.gltf.nodes.forEach((node) => {
              node.extras = { uuid: uuidv4() };
            });
            return this.writeJSON(outputPath, results.gltf);
          }),
        );
      }),
    );
  }

  checkIfModelExists(modelPath: string) {
    return from(
      fs.promises
        .access(modelPath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false),
    );
  }

  checkIfRepoDirectoryExists(repoId: string) {
    return from(
      fs.promises
        .access(join('repositories', repoId.toString()), fs.constants.F_OK)
        .then(() => true)
        .catch(() => false),
    );
  }

  readJSON(path: string) {
    return from(
      fse.readJson(path)
        .then((data) => data)
        .catch(() => null),
    );
  }

  readFile(path: string) { 
    return from(
      fs.promises
        .readFile(path)
        .then((file) => file)
        .catch(() => null),
    );
  }

  writeJSON(path: string, data: any): Observable<boolean> {
    return from(
      fse.writeJson(path, data)
        .then(() => true)
        .catch(() => false),
    )
  }

  writeRepoDirectoryById(repoId: string): Observable<boolean> {
    return from(
      fs.promises
        .mkdir(join('repositories', repoId.toString()), { recursive: true })
        .then(() => true)
        .catch(() => false),
    );
  }

  writeModelDirectoryById(repoId: string, modelId: string): Observable<boolean> {
    return from(
      fs.promises
        .mkdir(join('repositories', repoId.toString(), modelId.toString()), {
          recursive: true,
        })
        .then(() => true)
        .catch(() => false),
    );
  }

  deleteModel(path: string): Observable<boolean> {
    return from(
      fs.promises
        .rm(path.toString(), { force: true, recursive: true })
        .then(() => true)
        .catch(() => false),
    );
  }
}
