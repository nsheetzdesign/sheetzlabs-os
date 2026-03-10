import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  {
    category: 'Navigation',
    items: [
      { key: 'j', description: 'Next email' },
      { key: 'k', description: 'Previous email' },
      { key: 'o / Enter', description: 'Open email' },
      { key: 'u', description: 'Close preview' },
      { key: 'Escape', description: 'Close / go back' },
    ],
  },
  {
    category: 'Actions',
    items: [
      { key: 'e', description: 'Archive' },
      { key: '#', description: 'Delete' },
      { key: 's', description: 'Star / unstar' },
      { key: 'x', description: 'Select email' },
    ],
  },
  {
    category: 'Compose & Reply',
    items: [
      { key: 'c', description: 'Compose new email' },
      { key: 'r', description: 'Reply' },
      { key: 'a', description: 'Reply all' },
      { key: 'f', description: 'Forward' },
    ],
  },
  {
    category: 'Other',
    items: [
      { key: '/', description: 'Focus search' },
      { key: '?', description: 'Show this help' },
    ],
  },
];

export function KeyboardShortcutsHelp({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-zinc-100">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-200 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {shortcuts.map(({ category, items }) => (
            <div key={category}>
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                {category}
              </h3>
              <div className="space-y-1.5">
                {items.map(({ key, description }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">{description}</span>
                    <kbd className="px-2 py-0.5 text-xs font-mono bg-zinc-800 border border-zinc-700 rounded text-zinc-300">
                      {key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-zinc-500 text-center">
          Press{' '}
          <kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded font-mono">
            ?
          </kbd>{' '}
          anytime to show this help
        </p>
      </div>
    </div>
  );
}
