import { entity, role, text, date, uuid } from '@microsoft/rayfin-core';

@entity()
@role('authenticated', '*', {
  policy: (claims, item) => claims.sub.eq(item.user_id),
})
export class ChatInteraction {
  @uuid() id!: string;
  @text({ min: 1, max: 2000 }) question!: string;
  @text({ max: 4000 }) answer!: string;
  @date() createdAt!: Date;
  @text() user_id!: string;
}