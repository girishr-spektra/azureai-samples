// src/components/AskRag.tsx
import { useCallback, useEffect, useState } from 'react';
import {
  askRag,
  getRecentInteractions,
  type ChatInteractionItem,
} from '../services/askRag';

export function AskRag() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<ChatInteractionItem[]>([]);

  const refreshRecent = useCallback(async () => {
    try {
      setRecent(await getRecentInteractions());
    } catch {
      // A missing/unauthenticated backend just yields an empty list.
      setRecent([]);
    }
  }, []);

  useEffect(() => {
    void refreshRecent();
  }, [refreshRecent]);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q) return;
    setLoading(true);
    setAnswer('');
    setError('');
    try {
      setAnswer(await askRag(q));
      setQuestion('');
      await refreshRecent();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Ask Contoso Products</h2>
        <p className="text-sm text-gray-500">
          Ask about our outdoor gear — answers are grounded in the product catalog.
        </p>
      </div>

      <form onSubmit={(e) => void handleAsk(e)} className="flex gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="I need a new tent for 4 people, what would you recommend?"
          className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-40"
        >
          {loading ? 'Asking…' : 'Ask'}
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {answer && (
        <div className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Answer
          </h3>
          <p className="whitespace-pre-wrap text-sm text-gray-900">{answer}</p>
        </div>
      )}

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Recent questions
        </h3>
        {recent.length === 0 ? (
          <p className="text-sm text-gray-400">
            No questions yet. Ask something above to get started.
          </p>
        ) : (
          <ul className="space-y-2">
            {recent.map((item) => (
              <li
                key={item.id}
                className="rounded-xl bg-white px-4 py-3 shadow-sm border border-gray-100"
              >
                <p className="text-sm font-medium text-gray-900">{item.question}</p>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {item.answer}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
