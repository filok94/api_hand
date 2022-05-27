import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class DtoGetQuestionsQuery {
  @IsNotEmpty()
  readonly game_id: mongoose.Schema.Types.ObjectId;
}

export class IQueryGetGame {
  @IsNotEmpty()
  id: mongoose.Schema.Types.ObjectId;
}
