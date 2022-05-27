import { Person } from './schemas/game.schema';
export interface IReturnedOneQuestion {
  question: string;
  answers: string[];
  index: number;
}

export interface IReturnedCalculatedResult {
  right_answer: number;
  user_answer: number;
  is_right: boolean;
}

export interface IReturnedCalculatedData {
  person: Person;
  test_result: IReturnedCalculatedResult[];
}
