import { FileText, FileImage, FileArchive, File as FileIcon, Download } from 'lucide-react';

/** Attachment metadata as stored in email_attachments (Prompt 54A Part 3). */
export interface Attachment {
  id: string;
  filename: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  gmail_attachment_id: string | null;
  content_id?: string | null;
  is_inline?: boolean | null;
}

function formatBytes(n: number | null): string {
  if (!n || n <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let v = n;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v < 10 && i > 0 ? v.toFixed(1) : Math.round(v)} ${units[i]}`;
}

function iconFor(mime: string | null) {
  const m = (mime ?? '').toLowerCase();
  if (m.startsWith('image/')) return FileImage;
  if (m.includes('zip') || m.includes('compress') || m.includes('tar')) return FileArchive;
  if (m.includes('pdf') || m.startsWith('text/') || m.includes('document')) return FileText;
  return FileIcon;
}

/** Download chips for non-inline attachments. Click streams via the API proxy. */
export function AttachmentChips({
  emailId,
  attachments,
}: {
  emailId: string;
  attachments: Attachment[] | undefined;
}) {
  const visible = (attachments ?? []).filter(
    (a) => !a.is_inline && a.gmail_attachment_id && (a.filename || a.mime_type),
  );
  if (visible.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 border-t border-zinc-800 px-4 py-3">
      {visible.map((a) => {
        const Icon = iconFor(a.mime_type);
        const href = `/api/email/messages/${emailId}/attachments/${a.gmail_attachment_id}`;
        const name = a.filename || 'attachment';
        const size = formatBytes(a.size_bytes);
        return (
          <a
            key={a.id}
            href={href}
            target="_blank"
            rel="noreferrer"
            download={name}
            title={`Download ${name}${size ? ` (${size})` : ''}`}
            className="group flex max-w-[220px] items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-sm hover:border-emerald-600 hover:bg-zinc-800"
          >
            <Icon size={16} className="shrink-0 text-zinc-400" />
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-zinc-200">{name}</span>
              {size && <span className="text-xs text-zinc-500">{size}</span>}
            </span>
            <Download size={14} className="ml-1 shrink-0 text-zinc-500 group-hover:text-emerald-400" />
          </a>
        );
      })}
    </div>
  );
}
