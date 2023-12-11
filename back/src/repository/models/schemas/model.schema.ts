import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModelDocument = Model & Document;

@Schema({ versionKey: false })
export class Model {
  @Prop({ length: 200 })
  name: string;

  @Prop()
  type: ModelType;

  @Prop()
  filename: string;

  @Prop()
  path: string;

  @Prop()
  gltf: string;
}

export const ModelSchema = SchemaFactory.createForClass(Model);

export enum ModelType {
  Primary,
  Animation,
}
