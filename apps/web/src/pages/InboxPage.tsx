import { useState } from 'react';
import { z } from 'zod';
import {
  ChevronDown,
  ChevronLeft,
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
  email: 'bg-brand-red',
  whatsapp: 'bg-mode-sea',
  sms: 'bg-mode-ecom',
  voice: 'bg-brand-navy',
  slack: 'bg-brand-ink',
  teams: 'bg-mode-sea',
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
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1
            className="text-brand-navy"
            style={{
              fontFamily: 'Switzer, sans-serif',
              fontWeight: 400,
              fontSize: '28px',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}
          >
            Inbox
          </h1>
          <p className="ft-micro mt-2 text-brand-navy/55">
            Unified provider conversations · all channels
          </p>
        </div>
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible sm:px-0">
          <button className="ft-pill ft-pill-ghost ft-pill-sm shrink-0">
            All Entities <ChevronDown size={12} />
          </button>
          <button className="ft-pill ft-pill-ghost ft-pill-sm shrink-0">Public tracking</button>
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
            <>
              {/* Mobile chip rails */}
              <div className="space-y-2 lg:hidden">
                <div className="-mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1">
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
                    const active = folder === f;
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFolder(f)}
                        className={clsx(
                          'inline-flex shrink-0 items-center gap-1.5 border px-3 py-1.5 text-[12px] min-h-[36px]',
                          active
                            ? 'border-brand-navy bg-brand-navy text-brand-paper'
                            : 'border-brand-rule bg-brand-paper text-brand-navy/70',
                        )}
                      >
                        {FOLDER_ICONS[f]}
                        {FOLDER_LABELS[f]}
                        <span className="text-[10px] opacity-70">{count}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="-mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1">
                  {CHANNELS.map((c) => {
                    const active = channel === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setChannel(c.id)}
                        className={clsx(
                          'inline-flex shrink-0 items-center gap-1.5 border px-3 py-1.5 text-[12px] min-h-[36px]',
                          active
                            ? 'border-brand-navy bg-brand-bone text-brand-navy font-medium'
                            : 'border-brand-rule bg-brand-paper text-brand-navy/70',
                        )}
                      >
                        {c.icon}
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile single-pane swap */}
              <div className="lg:hidden">
                {!activeThreadId ? (
                  <div className="border border-brand-rule bg-brand-paper">
                    <div className="flex items-center gap-2 border-b border-brand-rule px-3 py-2">
                      <Search size={14} className="text-brand-navy/55" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search conversations…"
                        className="w-full bg-transparent text-[14px] text-brand-navy outline-none placeholder:text-brand-navy/40"
                      />
                    </div>
                    <ul>
                      {threads.length === 0 ? (
                        <li className="px-4 py-8 text-center text-[12px] text-brand-navy/55">
                          No conversations match this filter.
                        </li>
                      ) : (
                        threads.map((t) => (
                          <ThreadRow
                            key={t.id}
                            t={t}
                            active={false}
                            onSelect={() => setActiveThreadId(t.id)}
                          />
                        ))
                      )}
                    </ul>
                    <div className="border-t border-brand-rule p-3">
                      <button className="ft-pill ft-pill-primary ft-pill-sm w-full">
                        <Plus size={12} /> New message
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-brand-rule bg-brand-paper">
                    <div className="flex items-center gap-2 border-b border-brand-rule px-3 py-2">
                      <button
                        type="button"
                        onClick={() => setActiveThreadId(null)}
                        className="ft-eyebrow inline-flex items-center gap-1 text-brand-navy/65"
                      >
                        <ChevronLeft size={12} /> All threads
                      </button>
                    </div>
                    <div className="p-3">
                      <DataState state={messages}>
                        {(m) => <ThreadView messages={m.messages} />}
                      </DataState>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop 3-pane */}
              <div className="hidden grid-cols-12 gap-4 lg:grid">
                <aside className="col-span-3 border border-brand-rule bg-brand-paper p-3">
                  <button className="ft-pill ft-pill-primary ft-pill-sm mb-3 w-full">
                    <Plus size={12} /> New message
                  </button>
                  <div className="ft-eyebrow mb-1 px-1 text-brand-navy/55">Folders</div>
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
                              'flex w-full items-center justify-between gap-2 px-2 py-1.5 text-[12px]',
                              folder === f
                                ? 'bg-brand-bone text-brand-navy font-medium'
                                : 'text-brand-navy/65 hover:bg-brand-bone/50',
                            )}
                          >
                            <span className="flex items-center gap-2">
                              {FOLDER_ICONS[f]}
                              {FOLDER_LABELS[f]}
                            </span>
                            <span
                              className={clsx(
                                'text-[11px]',
                                folder === f ? 'text-brand-navy' : 'text-brand-navy/50',
                              )}
                            >
                              {count}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="ft-eyebrow mb-1 px-1 text-brand-navy/55">Channels</div>
                  <ul className="space-y-0.5">
                    {CHANNELS.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => setChannel(c.id)}
                          className={clsx(
                            'flex w-full items-center gap-2 px-2 py-1.5 text-[12px]',
                            channel === c.id
                              ? 'bg-brand-bone text-brand-navy font-medium'
                              : 'text-brand-navy/65 hover:bg-brand-bone/50',
                          )}
                        >
                          {c.icon}
                          {c.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </aside>
                <div className="col-span-5 border border-brand-rule bg-brand-paper">
                  <div className="flex items-center gap-2 border-b border-brand-rule px-3 py-2">
                    <Search size={14} className="text-brand-navy/55" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search conversations…"
                      className="w-full bg-transparent text-[14px] text-brand-navy outline-none placeholder:text-brand-navy/40"
                    />
                  </div>
                  <ul className="max-h-[640px] overflow-y-auto">
                    {threads.length === 0 ? (
                      <li className="px-4 py-8 text-center text-[12px] text-brand-navy/55">
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
                <div className="col-span-4 border border-brand-rule bg-brand-paper p-4">
                  {activeThreadId ? (
                    <DataState state={messages}>
                      {(m) => <ThreadView messages={m.messages} />}
                    </DataState>
                  ) : (
                    <div className="flex h-full min-h-[200px] items-center justify-center text-center text-[12px] text-brand-navy/55">
                      Select a conversation to view messages.
                    </div>
                  )}
                </div>
              </div>
            </>
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
          'flex w-full items-start gap-3 border-b border-brand-rule px-4 py-3 text-left transition-colors last:border-b-0 min-h-[64px]',
          active ? 'bg-brand-bone' : 'hover:bg-brand-bone/50',
        )}
      >
        <span
          className={clsx(
            'mt-1 h-2 w-2 shrink-0 rounded-full',
            CHANNEL_DOT[t.channel] ?? 'bg-brand-navy/40',
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-[14px] font-medium text-brand-navy">
              {t.counterpart ?? 'Unknown'}
              {t.unread ? (
                <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-brand-red" />
              ) : null}
              {t.starred ? <span className="ml-1 text-brand-red">★</span> : null}
            </div>
            <div className="text-[11px] text-brand-navy/50">{formatRelative(t.last_at)}</div>
          </div>
          <div className="mt-0.5 truncate text-[12px] text-brand-navy/65">{t.subject}</div>
          {t.shipment_ref ? (
            <div className="ft-micro mt-1 text-brand-red">{t.shipment_ref}</div>
          ) : null}
        </div>
      </button>
    </li>
  );
}

function ThreadView({ messages }: { messages: InboxMessage[] }) {
  if (messages.length === 0)
    return <div className="text-[12px] text-brand-navy/55">No messages on this thread yet.</div>;
  return (
    <ul className="space-y-3">
      {messages.map((m) => (
        <li
          key={m.id}
          className={clsx(
            'border p-3 text-[14px]',
            m.direction === 'in'
              ? 'border-brand-rule bg-brand-bone/60'
              : 'border-brand-navy/15 bg-brand-paper',
          )}
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[12px] font-medium text-brand-navy">{m.from_name}</span>
            <span className="text-[11px] text-brand-navy/50">{formatRelative(m.at)}</span>
          </div>
          <div className="whitespace-pre-wrap text-brand-navy">{m.body}</div>
        </li>
      ))}
    </ul>
  );
}
