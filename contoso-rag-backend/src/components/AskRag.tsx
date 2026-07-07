// src/components/AskRag.tsx
import { useState } from 'react';
import { askRag } from '../services/askRag';

export function AskRag({ onAnswered }: { onAnswered?: () => void }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q) return;
    setLoading(true);
    setAnswer('');
    setError('');
    try {
      setAnswer(await askRag(q));
      onAnswered?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Ask Contoso Products</h2>
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
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">Error: {error}</p>
      )}
      {answer && (
        <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-gray-800 shadow-sm border border-gray-100 whitespace-pre-wrap">
          {answer}
        </p>
      )}
    </section>
  );
}
