import { Plus, Trash2 } from "lucide-react";
import type { AvailabilityRules, DayRule, DayWindow } from "@sheetzlabs/shared";

/**
 * Cal.com-grade availability editor (BK-14). Controlled component: owns no state,
 * emits a new AvailabilityRules on every change. Keyed by full lowercase weekday
 * name to match the persisted JSONB shape and the server slot engine.
 */

const WEEKDAYS: { key: string; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const FALLBACK_TZ = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
  "UTC",
];

function tzList(current: string): string[] {
  let zones: string[] = FALLBACK_TZ;
  try {
    const supported = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] })
      .supportedValuesOf?.("timeZone");
    if (supported && supported.length) zones = supported;
  } catch {
    /* fall back to the curated list */
  }
  return zones.includes(current) ? zones : [current, ...zones];
}

const inputCls =
  "bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500";

export function AvailabilityEditor({
  value,
  onChange,
}: {
  value: AvailabilityRules;
  onChange: (next: AvailabilityRules) => void;
}) {
  const days = value.days ?? {};

  function setDay(key: string, next: DayRule) {
    onChange({ ...value, days: { ...days, [key]: next } });
  }

  function toggleDay(key: string, enabled: boolean) {
    const existing = days[key];
    const slots = existing?.slots?.length ? existing.slots : [{ start: "09:00", end: "17:00" }];
    setDay(key, { enabled, slots });
  }

  function setRange(key: string, idx: number, patch: Partial<DayWindow>) {
    const rule = days[key];
    if (!rule) return;
    const slots = rule.slots.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    setDay(key, { ...rule, slots });
  }

  function addRange(key: string) {
    const rule = days[key] ?? { enabled: true, slots: [] };
    setDay(key, { ...rule, enabled: true, slots: [...rule.slots, { start: "09:00", end: "17:00" }] });
  }

  function removeRange(key: string, idx: number) {
    const rule = days[key];
    if (!rule) return;
    const slots = rule.slots.filter((_, i) => i !== idx);
    setDay(key, { ...rule, slots, enabled: slots.length > 0 ? rule.enabled : false });
  }

  function setField<K extends keyof AvailabilityRules>(field: K, v: AvailabilityRules[K]) {
    onChange({ ...value, [field]: v });
  }

  return (
    <div className="space-y-5">
      {/* Timezone */}
      <div>
        <label className="block text-xs text-zinc-500 mb-1">Timezone</label>
        <select
          className={`${inputCls} w-full`}
          value={value.timezone}
          onChange={(e) => setField("timezone", e.target.value)}
        >
          {tzList(value.timezone).map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      {/* Weekly hours */}
      <div>
        <label className="block text-xs text-zinc-500 mb-2">Weekly hours</label>
        <div className="space-y-2">
          {WEEKDAYS.map(({ key, label }) => {
            const rule = days[key];
            const enabled = !!rule?.enabled;
            return (
              <div key={key} className="flex items-start gap-3 py-1">
                <label className="flex items-center gap-2 w-28 shrink-0 pt-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => toggleDay(key, e.target.checked)}
                    className="accent-emerald-500"
                    aria-label={`Available on ${label}`}
                  />
                  <span className="text-sm text-zinc-300">{label}</span>
                </label>

                <div className="flex-1 space-y-1.5">
                  {!enabled || !rule?.slots.length ? (
                    <span className="text-xs text-zinc-600 inline-block pt-1.5">Unavailable</span>
                  ) : (
                    rule.slots.map((slot, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => setRange(key, idx, { start: e.target.value })}
                          className={inputCls}
                          aria-label={`${label} start time`}
                        />
                        <span className="text-zinc-600 text-xs">–</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => setRange(key, idx, { end: e.target.value })}
                          className={inputCls}
                          aria-label={`${label} end time`}
                        />
                        <button
                          type="button"
                          onClick={() => removeRange(key, idx)}
                          className="p-1 text-zinc-600 hover:text-red-400"
                          aria-label={`Remove ${label} time range`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {idx === rule.slots.length - 1 && (
                          <button
                            type="button"
                            onClick={() => addRange(key)}
                            className="p-1 text-zinc-600 hover:text-emerald-400"
                            aria-label={`Add ${label} time range`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduling limits */}
      <div className="grid grid-cols-2 gap-3">
        <NumField
          label="Buffer before (min)"
          value={value.buffer_before_minutes ?? 0}
          onChange={(v) => setField("buffer_before_minutes", v)}
        />
        <NumField
          label="Buffer after (min)"
          value={value.buffer_after_minutes ?? 15}
          onChange={(v) => setField("buffer_after_minutes", v)}
        />
        <NumField
          label="Minimum notice (hours)"
          value={value.minimum_notice_hours ?? 24}
          onChange={(v) => setField("minimum_notice_hours", v)}
        />
        <NumField
          label="Rolling window (days)"
          value={value.date_range_days ?? 14}
          onChange={(v) => setField("date_range_days", v)}
        />
        <NumField
          label="Max bookings / day"
          value={value.max_bookings_per_day ?? 0}
          onChange={(v) => setField("max_bookings_per_day", v > 0 ? v : undefined)}
          placeholder="0 = no limit"
        />
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Slot increment</label>
          <select
            className={`${inputCls} w-full`}
            value={value.slot_increment_minutes ?? 0}
            onChange={(e) =>
              setField(
                "slot_increment_minutes",
                Number(e.target.value) > 0 ? Number(e.target.value) : undefined
              )
            }
          >
            <option value={0}>Match duration</option>
            <option value={15}>Every 15 min</option>
            <option value={30}>Every 30 min</option>
            <option value={60}>Every 60 min</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1">{label}</label>
      <input
        type="number"
        min={0}
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className={`${inputCls} w-full`}
      />
    </div>
  );
}
