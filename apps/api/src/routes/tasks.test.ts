import { describe, it, expect } from "vitest";
import { buildTaskPayload } from "./tasks";

// The column allowlist is the mass-assignment defense for the tasks API. These
// tests pin its behavior: known columns pass (coerced), unknown columns are
// dropped, invalid values for known columns reject, and required/partial rules.

describe("buildTaskPayload — create (partial: false)", () => {
  it("accepts a minimal valid create", () => {
    const r = buildTaskPayload({ title: "Write spec" }, { partial: false });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.payload).toEqual({ title: "Write spec" });
  });

  it("rejects a create without a title", () => {
    const r = buildTaskPayload({ description: "no title" }, { partial: false });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/title/);
  });

  it("rejects an empty title", () => {
    const r = buildTaskPayload({ title: "" }, { partial: false });
    expect(r.ok).toBe(false);
  });

  it("drops unknown columns (mass-assignment defense)", () => {
    const r = buildTaskPayload(
      {
        title: "T",
        // Server-controlled / non-existent — must NOT be assignable by a caller.
        id: "attacker-chosen",
        completed_at: "2020-01-01T00:00:00Z",
        created_at: "2020-01-01T00:00:00Z",
        is_admin: true,
        ticket_owner: "someone",
      },
      { partial: false }
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.payload).toEqual({ title: "T" });
      expect(r.payload).not.toHaveProperty("id");
      expect(r.payload).not.toHaveProperty("completed_at");
      expect(r.payload).not.toHaveProperty("created_at");
    }
  });

  it("coerces and keeps all allowed planning columns", () => {
    const r = buildTaskPayload(
      {
        title: "Deep work",
        description: "focus",
        status: "planned",
        priority: "high",
        estimated_minutes: 90,
        actual_minutes: 75,
        planned_date: "2026-06-15",
        sort_order: 3,
        due_date: "2026-06-20",
        venture_id: "11111111-1111-1111-1111-111111111111",
        ticket_id: "22222222-2222-2222-2222-222222222222",
      },
      { partial: false }
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.payload.estimated_minutes).toBe(90);
      expect(r.payload.planned_date).toBe("2026-06-15");
      expect(r.payload.status).toBe("planned");
      expect(r.payload.ticket_id).toBe("22222222-2222-2222-2222-222222222222");
    }
  });

  it("truncates float minutes to an int", () => {
    const r = buildTaskPayload({ title: "T", estimated_minutes: 45.9 }, { partial: false });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.payload.estimated_minutes).toBe(45);
  });

  it("rejects a non-numeric estimated_minutes", () => {
    const r = buildTaskPayload({ title: "T", estimated_minutes: "soon" }, { partial: false });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/estimated_minutes/);
  });

  it("rejects an unparseable planned_date", () => {
    const r = buildTaskPayload({ title: "T", planned_date: "not-a-date" }, { partial: false });
    expect(r.ok).toBe(false);
  });

  it("rejects an unknown status value", () => {
    const r = buildTaskPayload({ title: "T", status: "ascended" }, { partial: false });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/status/);
  });

  it("accepts both legacy and new status values", () => {
    for (const status of ["in-progress", "in_progress", "planned", "cancelled", "done"]) {
      const r = buildTaskPayload({ title: "T", status }, { partial: false });
      expect(r.ok, `status ${status}`).toBe(true);
    }
  });

  it("allows nulling a nullable column", () => {
    const r = buildTaskPayload({ title: "T", planned_date: null, ticket_id: null }, { partial: false });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.payload.planned_date).toBeNull();
      expect(r.payload.ticket_id).toBeNull();
    }
  });
});

describe("buildTaskPayload — update (partial: true)", () => {
  it("allows a title-less partial update", () => {
    const r = buildTaskPayload({ planned_date: "2026-06-15", sort_order: 1 }, { partial: true });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.payload).toEqual({ planned_date: "2026-06-15", sort_order: 1 });
  });

  it("rejects an empty partial update", () => {
    const r = buildTaskPayload({}, { partial: true });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/no editable fields/);
  });

  it("drops unknown columns on update too", () => {
    const r = buildTaskPayload({ sort_order: 2, completed_at: "x" }, { partial: true });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.payload).toEqual({ sort_order: 2 });
  });
});

describe("buildTaskPayload — bad bodies", () => {
  it("rejects null / array / non-object bodies", () => {
    expect(buildTaskPayload(null, { partial: false }).ok).toBe(false);
    expect(buildTaskPayload([], { partial: false }).ok).toBe(false);
    expect(buildTaskPayload("nope" as unknown, { partial: false }).ok).toBe(false);
  });
});
