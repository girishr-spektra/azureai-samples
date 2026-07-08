import { ChatInteraction } from './ChatInteraction.js';

export type AppSchema = {
  ChatInteraction: ChatInteraction;
};

export const schema = [ChatInteraction];
