import { useState } from 'react';
import { z } from 'zod';
import {
  ChevronDown,
  Inbox,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Slack,
  Star,
  Sparkles,
  Search,
  Plus,
  Archive,
} from 'lucide-react';
import {
  InboxResponseSchema,
  InboxMessageSchema,
  type InboxThread,
  type InboxMessage,
} from '@flowtrack/shared';
import { useApi } from '../lib/useApi';
import { DataState } from '../components/ui/DataState';
import { formatRelative } from '../lib/format';
import clsx from 'clsx';

type Folder = 'inbox' | 'unread' | 'starred' | 'agi_escalations' | 'archived';
type Channel = 'all' | 'email' | 'whatsapp' | 'sms' | 'voice' | 'slack' | 'teams';

const FOLDER_LABELS: Record<Folder, string> = {
  inbox: 'Inbox',
  unread: 'Unread',
  starred: 'Starred',
  agi_escalations: 'AGI escalations',
  archived: 'Archived',
};
const FOLDER_ICONS: Record<Folder, JSX.Element> = {
  inbox: <Inbox size={14} />,
  unread: <Mail size={14} />,
  starred: <Star size={14} />,
  agi_escalations: <Sparkles size={14} />,
  archived: <Archive size={14} />,
};

const CHANNELS: { id: Channel; label: string; icon: JSX.Element }[] = [
  { id: 'all', label: 'All channels', icon: <Mail size={14} /> },
  { id: 'email', label: 'Email', icon: <Mail size={14} /> },
  { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={14} /> },
  { id: 'sms', label: 'SMS', icon: <MessageSquare size={14} /> },
  { id: 'voice', label: 'Voice', icon: <Phone size={14} /> },
  { id: 'slack', label: 'Slack', icon: <Slack size={14} /> },
  { id: 'teams', label: 'Teams', icon: <MessageSquare size={14} /> },
];

const CHANNEL_DOT: Record<string, string> = {
  email: 'bg-red-500',
  whatsapp: 'bg-emerald-500',
  sms: 'bg-amber-500',
  voice: 'bg-violet-500',
  slack: 'bg-pink-500',
  teams: 'bg-blue-500',
};

const ThreadMessagesSchema = z.object({ messages: z.array(InboxMessageSchema) });

export function InboxPage() {
  const [folder, setFolder] = useState<Folder>('inbox');
  const [channel, setChannel] = useState<Channel>('all');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const folderQ = folder === 'unread' ? 'inbox' : folder;
  const state = useApi(`/inbox?folder=${folderQ}`, InboxResponseSchema);
  const messages = useApi(
    activeThreadId ? `/inbox/threads/${activeThreadId}` : null,
    ThreadMessagesSchema,
  );

  return (
    <div className="mx-auto max-w-[1280px] space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">Inbox</h1>
          <p className="mt-0.5 text-xs text-text-secondary">
            Unified provider conversations · all channels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-card px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-canvas">
            All Entities <ChevronDown size={12} />
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-card px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-canvas">
            Public tracking
          </button>
        </div>
      </header>

      <DataState state={state}>
        {(data) => {
          let threads = data.threads;
          if (folder === 'unread') threads = threads.filter((t) => t.unread);
          if (channel !== 'all') threads = threads.filter((t) => t.channel === channel);
          if (search.trim()) {
            const q = search.toLowerCase();
            threads = threads.filter(
              (t) =>
                t.subject.toLowerCase().includes(q) ||
                (t.counterpart ?? '').toLowerCase().includes(q),
            );
          }
          return (
            <div className="grid grid-cols-12 gap-4">
              <aside className="col-span-3 rounded-lg border border-border-subtle bg-surface-card p-3">
                <button className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                  <Plus size={12} /> New message
                </button>
                <div className="mb-1 px-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Folders
                </div>
                <ul className="mb-3 space-y-0.5">
                  {(Object.keys(FOLDER_LABELS) as Folder[]).map((f) => {
                    const count =
                      f === 'unread'
                        ? data.counts.unread
                        : f === 'starred'
                          ? data.counts.starred
                          : f === 'agi_escalations'
                            ? data.counts.agi_escalations
                            : f === 'archived'
                              ? data.counts.archived
                              : data.counts.inbox;
                    return (
                      <li key={f}>
                        <button
                          type="button"
                          onClick={() => setFolder(f)}
                          className={clsx(
                            'flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs',
                            folder === f
                              ? 'bg-blue-50 font-semibold text-blue-700'
                              : 'text-text-secondary hover:bg-surface-canvas',
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {FOLDER_ICONS[f]}
                            {FOLDER_LABELS[f]}
                          </span>
                          <span className={clsx('text-[11px]', folder === f ? 'text-blue-700' : 'text-text-muted')}>
                            {count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="mb-1 px-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Channels
                </div>
                <ul className="space-y-0.5">
                  {CHANNELS.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => setChannel(c.id)}
                        className={clsx(
                          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs',
                          channel === c.id
                            ? 'bg-blue-50 font-semibold text-blue-700'
                            : 'text-text-secondary hover:bg-surface-canvas',
                        )}
                      >
                        {c.icon}
                        {c.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>
              <div className="col-span-5 rounded-lg border border-border-subtle bg-surface-card">
                <div className="flex items-center gap-2 border-b border-border-subtle px-3 py-2">
                  <Search size={14} className="text-text-muted" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search conversations…"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
                  />
                </div>
                <ul className="max-h-[640px] overflow-y-auto">
                  {threads.length === 0 ? (
                    <li className="px-4 py-8 text-center text-xs text-text-muted">
                      No conversations match this filter.
                    </li>
                  ) : (
                    threads.map((t) => (
                      <ThreadRow
                        key={t.id}
                        t={t}
                        active={activeThreadId === t.id}
                        onSelect={() => setActiveThreadId(t.id)}
                      />
                    ))
                  )}
                </ul>
              </div>
              <div className="col-span-4 rounded-lg border border-border-subtle bg-surface-card p-4">
                {activeThreadId ? (
                  <DataState state={messages}>
                    {(m) => <ThreadView messages={m.messages} />}
                  </DataState>
                ) : (
                  <div className="flex h-full min-h-[200px] items-center justify-center text-center text-xs text-text-muted">
                    Select a conversation to view messages.
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </DataState>
    </div>
  );
}

function ThreadRow({
  t,
  active,
  onSelect,
}: {
  t: InboxThread;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={clsx(
          'flex w-full items-start gap-3 border-b border-border-subtle px-4 py-3 text-left transition-colors last:border-b-0',
          active ? 'bg-blue-50' : 'hover:bg-surface-canvas',
        )}
      >
        <span
          className={clsx(
            'mt-1 h-2 w-2 shrink-0 rounded-full',
            CHANNEL_DOT[t.channel] ?? 'bg-slate-400',
          )}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-sm font-medium text-text-primary">
              {t.counterpart ?? 'Unknown'}
              {t.unread ? <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-500" /> : null}
              {t.starred ? <span className="ml-1 text-amber-500">★</span> : null}
            </div>
            <div className="text-[11px] text-text-muted">{formatRelative(t.last_at)}</div>
          </div>
          <div className="mt-0.5 truncate text-xs text-text-secondary">{t.subject}</div>
          {t.shipment_ref ? (
            <div className="mt-0.5 text-[10px] font-medium text-blue-600">{t.shipment_ref}</div>
          ) : null}
        </div>
      </button>
    </li>
  );
}

function ThreadView({ messages }: { messages: InboxMessage[] }) {
  if (messages.length === 0)
    return (
      <div className="text-xs text-text-muted">No messages on this thread yet.</div>
    );
  return (
    <ul className="space-y-3">
      {messages.map((m) => (
        <li
          key={m.id}
          className={clsx(
            'rounded-md p-3 text-sm',
            m.direction === 'in'
              ? 'bg-surface-canvas border border-border-subtle'
              : 'bg-blue-50 border border-blue-100',
          )}
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-text-primary">{m.from_name}</span>
            <span className="text-[11px] text-text-muted">{formatRelative(m.at)}</span>
          </div>
          <div className="whitespace-pre-wrap text-text-primary">{m.body}</div>
        </li>
      ))}
    </ul>
  );
}
