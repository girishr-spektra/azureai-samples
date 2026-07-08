import { entity, role, text, date, uuid } from '@microsoft/rayfin-core';

// One row per question a signed-in user asks the RAG app. The row is written
// browser-side through the GraphQL data API after the grounded answer is
// generated, and read back for the "Recent questions" list.
//
// Every @text field is BOUNDED. An unbounded @text becomes NVARCHAR(MAX) on
// MSSQL (the Fabric dialect), which breaks GraphQL schema generation — so
// `answer` is capped at 4000 (the largest non-MAX NVARCHAR width).
@entity()
@role('authenticated', '*', {
  // Row-level security: a user can only ever see or mutate their own rows.
  policy: (claims, item) => claims.sub.eq(item.user_id),
})
export class ChatInteraction {
  @uuid() id!: string;
  @text({ min: 1, max: 2000 }) question!: string;
  @text({ max: 4000 }) answer!: string;
  @date() createdAt!: Date;
  @text({ max: 200 }) user_id!: string;
}
