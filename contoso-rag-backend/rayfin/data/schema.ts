import { Todo } from './Todo.js';
import { ChatInteraction } from './ChatInteraction.js';

export type TodoAppSchema = {
  Todo: Todo;
  ChatInteraction: ChatInteraction;
};

export const schema = [Todo, ChatInteraction];