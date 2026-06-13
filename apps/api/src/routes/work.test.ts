import { describe, it, expect } from "vitest";
import { nextDay, isUnfinished, selectRolloverTasks, elapsedWorkMinutes } from "./work";

describe("nextDay", () => {
  it("advances one calendar day", () => {
    expect(nextDay("2026-06-13")).toBe("2026-06-14");
  });
  it("crosses month boundaries", () => {
    expect(nextDay("2026-06-30")).toBe("2026-07-01");
  });
  it("crosses year boundaries", () => {
    expect(nextDay("2026-12-31")).toBe("2027-01-01");
  });
  it("handles a leap day", () => {
    expect(nextDay("2028-02-28")).toBe("2028-02-29");
    expect(nextDay("2028-02-29")).toBe("2028-03-01");
  });
  it("is UTC-stable regardless of host tz (no off-by-one)", () => {
    // Plain string math, not Date local parsing — same result everywhere.
    expect(nextDay("2026-01-01")).toBe("2026-01-02");
  });
});

describe("isUnfinished", () => {
  it("treats done/cancelled as finished", () => {
    expect(isUnfinished("done")).toBe(false);
    expect(isUnfinished("cancelled")).toBe(false);
    expect(isUnfinished("DONE")).toBe(false);
  });
  it("treats everything else (incl. null) as unfinished", () => {
    expect(isUnfinished("todo")).toBe(true);
    expect(isUnfinished("in-progress")).toBe(true);
    expect(isUnfinished("planned")).toBe(true);
    expect(isUnfinished(null)).toBe(true);
    expect(isUnfinished(undefined)).toBe(true);
  });
});

describe("selectRolloverTasks", () => {
  const tasks = [
    { id: "a", status: "todo", sort_order: 0 },
    { id: "b", status: "done", sort_order: 1 },
    { id: "c", status: "in-progress", sort_order: 2 },
    { id: "d", status: "cancelled", sort_order: 3 },
    { id: "e", status: "planned", sort_order: 4 },
  ];

  it("keeps only unfinished tasks", () => {
    const moved = selectRolloverTasks(tasks).map((t) => t.id);
    expect(moved).toEqual(["a", "c", "e"]);
  });

  it("preserves order + does not mutate sort_order", () => {
    const moved = selectRolloverTasks(tasks);
    expect(moved.map((t) => t.sort_order)).toEqual([0, 2, 4]);
    // Originals untouched (we only ever change planned_date downstream).
    expect(tasks.map((t) => t.sort_order)).toEqual([0, 1, 2, 3, 4]);
  });

  it("returns empty when all tasks are finished", () => {
    expect(selectRolloverTasks([{ id: "x", status: "done" }])).toEqual([]);
  });
});

describe("elapsedWorkMinutes", () => {
  it("floors real elapsed minutes", () => {
    const start = "2026-06-13T10:00:00.000Z";
    const end = "2026-06-13T10:24:30.000Z"; // 24.5 min
    expect(elapsedWorkMinutes(start, end, 25 * 60)).toBe(24);
  });

  it("clamps to the planned duration (no runaway from a left-open timer)", () => {
    const start = "2026-06-13T10:00:00.000Z";
    const end = "2026-06-13T15:00:00.000Z"; // 5h elapsed
    expect(elapsedWorkMinutes(start, end, 25 * 60)).toBe(25); // capped at 25
  });

  it("never goes negative", () => {
    const start = "2026-06-13T10:00:00.000Z";
    const end = "2026-06-13T09:00:00.000Z"; // ended before start (clock skew)
    expect(elapsedWorkMinutes(start, end, 25 * 60)).toBe(0);
  });

  it("returns 0 on unparseable input", () => {
    expect(elapsedWorkMinutes("nope", "also nope", 1500)).toBe(0);
  });
});
