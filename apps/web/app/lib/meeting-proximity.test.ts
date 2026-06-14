import { describe, it, expect } from "vitest";
import { meetingProximity, type ProximityEvent } from "./meeting-proximity";

// Fixed reference instant so the test is deterministic (no Date.now()).
const NOW = Date.parse("2026-06-13T12:00:00.000Z");
const at = (offsetMin: number) => new Date(NOW + offsetMin * 60_000).toISOString();

/** A 30-minute meeting starting `startMin` from NOW. */
function meeting(startMin: number, opts: Partial<ProximityEvent> = {}): ProximityEvent {
  return {
    title: opts.title ?? `mtg@${startMin}`,
    start_at: at(startMin),
    end_at: at(startMin + 30),
    is_time_block: opts.is_time_block ?? false,
    all_day: opts.all_day ?? false,
  };
}

describe("meetingProximity", () => {
  it("is RED (in-progress) when a meeting is currently happening", () => {
    const r = meetingProximity(NOW, [meeting(-10)]); // started 10m ago, ends in 20m
    expect(r.level).toBe("in-progress");
    expect(r.title).toBe("mtg@-10");
    expect(r.startAt).toBe(at(-10));
  });

  it("is ORANGE (soon) when the next meeting starts within 5 minutes (3m)", () => {
    const r = meetingProximity(NOW, [meeting(3)]);
    expect(r.level).toBe("soon");
    expect(r.title).toBe("mtg@3");
  });

  it("is YELLOW (upcoming) when the next meeting starts within 15 minutes (12m)", () => {
    const r = meetingProximity(NOW, [meeting(12)]);
    expect(r.level).toBe("upcoming");
  });

  it("is GREEN (clear) when the next meeting is more than 15 minutes away (25m)", () => {
    const r = meetingProximity(NOW, [meeting(25)]);
    expect(r.level).toBe("clear");
    expect(r.title).toBe("mtg@25"); // still surfaces the next meeting for the tooltip
  });

  it("is GREEN (clear) when there are no meetings", () => {
    const r = meetingProximity(NOW, []);
    expect(r.level).toBe("clear");
    expect(r.title).toBeNull();
    expect(r.startAt).toBeNull();
  });

  it("treats exactly 5m as soon and exactly 15m as upcoming (inclusive boundaries)", () => {
    expect(meetingProximity(NOW, [meeting(5)]).level).toBe("soon");
    expect(meetingProximity(NOW, [meeting(15)]).level).toBe("upcoming");
  });

  it("excludes time blocks and all-day events from proximity", () => {
    const r = meetingProximity(NOW, [
      meeting(3, { is_time_block: true }),
      meeting(4, { all_day: true }),
    ]);
    expect(r.level).toBe("clear");
    expect(r.title).toBeNull();
  });

  it("in-progress wins even when an imminent meeting is also queued", () => {
    const r = meetingProximity(NOW, [meeting(2), meeting(-5)]);
    expect(r.level).toBe("in-progress");
    expect(r.title).toBe("mtg@-5");
  });

  it("picks the SOONEST upcoming meeting regardless of input order", () => {
    const r = meetingProximity(NOW, [meeting(40), meeting(12), meeting(60)]);
    expect(r.level).toBe("upcoming");
    expect(r.title).toBe("mtg@12");
  });

  it("ignores already-ended meetings", () => {
    const r = meetingProximity(NOW, [meeting(-90)]); // ended 60m ago
    expect(r.level).toBe("clear");
  });
});
