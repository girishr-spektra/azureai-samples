// src/services/askRag.ts
import { getRayfinClient, isLocalBackend } from './rayfinClient';

export interface Interaction {
  id: string;
  question: string;
  answer: string;
  createdAt: Date;
}

// Local-dev fallback: keep interactions in memory so the sample runs without
// a deployed Fabric backend (mirrors the pattern in todos.ts).
let inMemory: Interaction[] = [];

// Retrieve the most relevant product documents from the Azure AI Search index.
async function retrieveDocuments(question: string): Promise<string> {
  const response = await fetch(
    `${import.meta.env.VITE_SEARCH_ENDPOINT}/indexes/${import.meta.env.VITE_AISEARCH_INDEX_NAME}/docs/search?api-version=2024-07-01`,
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
    throw new Error(`Azure AI Search request failed (${response.status}).`);
  }
  const results = await response.json();
  return (results.value ?? [])
    .map((doc: { title: string; content: string }) => `${doc.title}: ${doc.content}`)
    .join('\n');
}

// Generate a grounded answer using the Microsoft Foundry (Azure OpenAI) endpoint.
async function getGroundedAnswer(question: string, context: string): Promise<string> {
  const response = await fetch(`${import.meta.env.VITE_FOUNDRY_OPENAI_ENDPOINT}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': import.meta.env.VITE_FOUNDRY_API_KEY,
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_CHAT_MODEL,
      input: `Answer the question using only the product documents below. Cite the products you recommend.\n\nDocuments:\n${context}\n\nQuestion: ${question}`,
    }),
  });
  if (!response.ok) {
    throw new Error(`Microsoft Foundry request failed (${response.status}).`);
  }
  const result = await response.json();
  return result.output_text ?? '';
}

export async function askRag(question: string): Promise<string> {
  const context = await retrieveDocuments(question);
  const answer = await getGroundedAnswer(question, context);

  // Persist the interaction so it appears in the "Recent questions" list.
  if (isLocalBackend()) {
    inMemory.unshift({ id: crypto.randomUUID(), question, answer, createdAt: new Date() });
    return answer;
  }

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

// Read past interactions for the signed-in user (row-level security is enforced
// server-side by the ChatInteraction @role policy).
export async function listInteractions(): Promise<Interaction[]> {
  if (isLocalBackend()) {
    return [...inMemory];
  }

  const client = getRayfinClient();
  const rows = await client.data.ChatInteraction.select([
    'id',
    'question',
    'answer',
    'createdAt',
  ])
    .orderBy({ createdAt: 'desc' })
    .execute();
  return rows as Interaction[];
}
