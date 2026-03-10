import { useState } from 'react';
import { useFetcher } from 'react-router';
import { Clock, Sun, Moon, Calendar } from 'lucide-react';

interface Props {
  emailId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  position?: { x: number; y: number };
}

export function SnoozePicker({ emailId, isOpen, onClose, onSuccess, position }: Props) {
  const fetcher = useFetcher();
  const [showCustom, setShowCustom] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('09:00');

  if (!isOpen) return null;

  const snoozeOptions = [
    {
      label: 'Later today',
      icon: Clock,
      getTime: () => {
        const now = new Date();
        now.setHours(now.getHours() + 4);
        return now.toISOString();
      },
      sublabel: () => {
        const now = new Date();
        now.setHours(now.getHours() + 4);
        return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      },
    },
    {
      label: 'Tomorrow',
      icon: Sun,
      getTime: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8, 0, 0, 0);
        return tomorrow.toISOString();
      },
      sublabel: () => 'Tomorrow at 8:00 AM',
    },
    {
      label: 'This weekend',
      icon: Moon,
      getTime: () => {
        const now = new Date();
        const saturday = new Date(now);
        saturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7 || 7));
        saturday.setHours(9, 0, 0, 0);
        return saturday.toISOString();
      },
      sublabel: () => {
        const now = new Date();
        const saturday = new Date(now);
        saturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7 || 7));
        return saturday.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      },
    },
    {
      label: 'Next week',
      icon: Calendar,
      getTime: () => {
        const now = new Date();
        const monday = new Date(now);
        monday.setDate(now.getDate() + ((8 - now.getDay()) % 7 || 7));
        monday.setHours(8, 0, 0, 0);
        return monday.toISOString();
      },
      sublabel: () => {
        const now = new Date();
        const monday = new Date(now);
        monday.setDate(now.getDate() + ((8 - now.getDay()) % 7 || 7));
        return `Mon, ${monday.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
      },
    },
  ];

  const handleSnooze = (until: string) => {
    fetcher.submit(
      { until },
      { method: 'post', action: `/dashboard/inbox/${emailId}/snooze` }
    );
    onClose();
    onSuccess?.();
  };

  const handleCustomSnooze = () => {
    if (!customDate) return;
    const dateTime = new Date(`${customDate}T${customTime}`);
    handleSnooze(dateTime.toISOString());
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Picker */}
      <div
        className="fixed z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl w-64"
        style={position ? { left: position.x, top: position.y } : { right: 16, top: 100 }}
      >
        <div className="p-2">
          <div className="text-xs text-zinc-500 uppercase px-2 py-1">Snooze until</div>

          {snoozeOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => handleSnooze(option.getTime())}
              className="flex items-center justify-between w-full px-3 py-2 hover:bg-zinc-800 rounded text-sm"
            >
              <div className="flex items-center gap-3">
                <option.icon size={16} className="text-zinc-500" />
                <span>{option.label}</span>
              </div>
              <span className="text-xs text-zinc-500">{option.sublabel()}</span>
            </button>
          ))}

          <div className="border-t border-zinc-800 my-2" />

          {!showCustom ? (
            <button
              onClick={() => setShowCustom(true)}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-zinc-800 rounded text-sm"
            >
              <Calendar size={16} className="text-zinc-500" />
              <span>Pick date & time</span>
            </button>
          ) : (
            <div className="px-3 py-2 space-y-2">
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm"
              />
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCustomSnooze}
                  disabled={!customDate}
                  className="flex-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded text-sm disabled:opacity-50"
                >
                  Snooze
                </button>
                <button
                  onClick={() => setShowCustom(false)}
                  className="px-3 py-1.5 border border-zinc-700 hover:border-zinc-600 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
