// src/services/askRag.ts
//
// Browser-side retrieve-then-generate for the Contoso Products RAG app.
//
// Because a deployed Rayfin/Fabric app has NO server compute (it provisions
// only a SQL/GraphQL data API, Fabric SSO auth, storage, and static hosting),
// the retrieval + LLM call must run in the browser: the front-end talks to
// Azure AI Search and the Microsoft Foundry Azure OpenAI endpoint directly and
// uses Rayfin only for auth + persisting chat history via the GraphQL data API.
//
// LAB-ONLY: the Search key and Foundry key are shipped to the browser via
// VITE_* env vars. That is acceptable for this hands-on lab but is NOT
// production-secure — real deployments must move those keys behind a server
// (see the CORS/proxy note in the lab guide).

import { getRayfinClient } from './rayfinClient';

export interface ChatInteractionItem {
  id: string;
  question: string;
  answer: string;
  createdAt: Date;
}

// Retrieve the most relevant product documents from the Azure AI Search index.
// CORS is enabled on the index (create_search_index.py sets allowed_origins),
// so this fetch can run from the browser.
async function retrieveDocuments(question: string): Promise<string> {
  const endpoint = import.meta.env.VITE_SEARCH_ENDPOINT.replace(/\/$/, '');
  const index = import.meta.env.VITE_AISEARCH_INDEX_NAME;
  const response = await fetch(
    `${endpoint}/indexes/${index}/docs/search?api-version=2024-07-01`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': import.meta.env.VITE_SEARCH_KEY,
      },
      body: JSON.stringify({ search: question, top: 5, select: 'title,content' }),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Azure AI Search returned ${response.status}: ${await response.text()}`,
    );
  }
  const results = await response.json();
  return (results.value ?? [])
    .map((doc: { title: string; content: string }) => `${doc.title}: ${doc.content}`)
    .join('\n');
}

// Generate a grounded answer with the Microsoft Foundry Azure OpenAI endpoint
// (chat completions), passing the retrieved product context as grounding.
async function getGroundedAnswer(question: string, context: string): Promise<string> {
  const endpoint = import.meta.env.VITE_FOUNDRY_OPENAI_ENDPOINT.replace(/\/$/, '');
  const model = import.meta.env.VITE_CHAT_MODEL;
  const response = await fetch(
    `${endpoint}/openai/deployments/${model}/chat/completions?api-version=2024-10-21`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': import.meta.env.VITE_FOUNDRY_API_KEY,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content:
              'You are a Contoso Trek outdoor-gear product assistant. Answer the ' +
              'question using ONLY the product documents provided. Recommend and ' +
              'name specific products. If the documents do not contain the answer, ' +
              'say you could not find a matching product.',
          },
          {
            role: 'user',
            content: `Product documents:\n${context}\n\nQuestion: ${question}`,
          },
        ],
      }),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Foundry Azure OpenAI returned ${response.status}: ${await response.text()}`,
    );
  }
  const result = await response.json();
  return result.choices?.[0]?.message?.content ?? '(no answer returned)';
}

// Full RAG turn: retrieve → generate → persist the Q&A for this user.
export async function askRag(question: string): Promise<string> {
  const context = await retrieveDocuments(question);
  const answer = await getGroundedAnswer(question, context);

  // Persist the interaction through the Rayfin data API (GraphQL). The row is
  // stamped with the signed-in user's id so row-level security scopes it.
  const client = getRayfinClient();
  const session = client.auth.getSession();
  if (!session.isAuthenticated || !session.user) {
    throw new Error('Cannot save interaction: user is not authenticated.');
  }
  await client.data.ChatInteraction.create({
    question,
    answer,
    createdAt: new Date(),
    user_id: session.user.id,
  });

  return answer;
}

// Read back this user's recent questions for the "Recent questions" list.
// Row-level security means only the caller's own rows are ever returned.
export async function getRecentInteractions(
  limit = 10,
): Promise<ChatInteractionItem[]> {
  const client = getRayfinClient();
  const results = await client.data.ChatInteraction.select([
    'id',
    'question',
    'answer',
    'createdAt',
  ])
    .orderBy({ createdAt: 'desc' })
    .execute();
  return (results as ChatInteractionItem[]).slice(0, limit);
}
