import { useCallback, useEffect, useState } from 'react';
import { AskRag } from '../components/AskRag';
import { useAuth } from '@/hooks/AuthContext';
import { listInteractions, type Interaction } from '@/services/askRag';

export function HomePage() {
  const { signOut, user } = useAuth();
  const [history, setHistory] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setHistory(await listInteractions());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Contoso Product Assistant</h1>
        <div className="flex items-center gap-4">
          {user?.email && (
            <span className="text-sm text-gray-600" title={user.email}>
              {user.email}
            </span>
          )}
          <button
            onClick={() => void signOut()}
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
            aria-label="Sign out"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10">
        <AskRag onAnswered={() => void refresh()} />

        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Recent questions
          </h2>
          {loading ? (
            <p className="text-center text-gray-400 text-sm">Loading…</p>
          ) : history.length === 0 ? (
            <p className="text-gray-400 text-sm">No questions yet. Ask something above!</p>
          ) : (
            <ul className="space-y-3">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl bg-white px-4 py-3 shadow-sm border border-gray-100"
                >
                  <p className="text-sm font-medium text-gray-900">{item.question}</p>
                  <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{item.answer}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
