/**
 * Prompt 67 — Work mode (Plan + Work).
 *
 * API-level coverage against the real auth boundary (founder JWT via `api()`) plus
 * targeted UI checks (page renders, view in URL, responsive invariant, meetings as
 * read-only anchors). Future-dated plan_date/daily-plan rows keep tests away from
 * the founder's real "today". Everything is `[E2E]`-tagged and cleaned up.
 */
import { test, expect } from "@playwright/test";
import { api, apiPublic } from "../lib/api";
import { admin } from "../lib/supabase";
import { E2E_TAG, e2eSubject } from "../lib/tags";

interface TaskRow {
  id: string;
  title: string;
  status: string | null;
  planned_date: string | null;
  estimated_minutes: number | null;
  actual_minutes: number | null;
}
interface EventRow {
  id: string;
  is_time_block: boolean | null;
  task_id: string | null;
}
interface FocusRow {
  id: string;
  status: string;
  kind: string;
  started_at: string;
  task_id: string | null;
}
interface CaptureRow {
  id: string;
  converted_task_id: string | null;
}

// Far-future dates so we never touch the founder's real planning data.
const PLAN_DATE = "2099-06-13";
const NEXT_DATE = "2099-06-14";

test.describe("work mode — API (Prompt 67)", () => {
  const taskIds: string[] = [];
  const blockIds: string[] = [];
  const captureIds: string[] = [];
  const focusIds: string[] = [];

  test.afterAll(async () => {
    // Stop any running sessions we created, then purge everything.
    for (const id of focusIds) await api(`/focus/${id}/abandon`, { method: "POST" }).catch(() => {});
    for (const id of blockIds) await api(`/calendar/time-blocks/${id}`, { method: "DELETE" }).catch(() => {});
    if (focusIds.length) await admin().from("focus_sessions").delete().in("id", focusIds);
    if (captureIds.length) await admin().from("captures").delete().in("id", captureIds);
    for (const id of taskIds) await api(`/tasks/${id}`, { method: "DELETE" }).catch(() => {});
    await admin().from("daily_plans").delete().in("plan_date", [PLAN_DATE, NEXT_DATE]);
  });

  test("focus endpoints reject unauthenticated calls (401)", async () => {
    const res = await apiPublic("/focus/start", {
      method: "POST",
      body: JSON.stringify({ duration_seconds: 1500 }),
    });
    expect(res.status).toBe(401);
  });

  test("drag-to-timebox: a task-linked block stamps the task's planned_date and leaves the rail", async () => {
    const created = await api<{ task: TaskRow }>("/tasks", {
      method: "POST",
      body: JSON.stringify({ title: e2eSubject("timebox"), estimated_minutes: 30, status: "todo" }),
    });
    expect(created.status).toBe(201);
    const task = created.body.task;
    taskIds.push(task.id);

    // Appears in the unscheduled rail before timeboxing.
    const before = await api<{ tasks: TaskRow[] }>("/calendar/tasks/unscheduled");
    expect(before.body.tasks.some((t) => t.id === task.id)).toBe(true);

    // Timebox it (what the drag handler posts): block + planned_date.
    const block = await api<{ event: EventRow }>("/calendar/time-blocks", {
      method: "POST",
      body: JSON.stringify({
        task_id: task.id,
        start_at: `${PLAN_DATE}T15:00:00.000Z`,
        planned_date: PLAN_DATE,
      }),
    });
    expect(block.status, JSON.stringify(block.body)).toBe(200);
    blockIds.push(block.body.event.id);
    expect(block.body.event.is_time_block).toBe(true);
    expect(block.body.event.task_id).toBe(task.id);

    // The task now carries planned_date AND is no longer unscheduled (it has a block).
    const after = await api<{ task: TaskRow }>(`/tasks/${task.id}`);
    expect(after.body.task.planned_date).toBe(PLAN_DATE);
    const rail = await api<{ tasks: TaskRow[] }>("/calendar/tasks/unscheduled");
    expect(rail.body.tasks.some((t) => t.id === task.id)).toBe(false);
  });

  test("quick capture → convert → task appears in the rail", async () => {
    const text = `${E2E_TAG} buy more whiteboards`;
    const cap = await api<{ capture: CaptureRow }>("/knowledge/captures", {
      method: "POST",
      body: JSON.stringify({ content: text, capture_type: "text" }),
    });
    expect(cap.status).toBe(200);
    const captureId = cap.body.capture.id;
    captureIds.push(captureId);

    const conv = await api<{ task: TaskRow }>(`/knowledge/captures/${captureId}/convert`, {
      method: "POST",
    });
    expect(conv.status, JSON.stringify(conv.body)).toBe(201);
    const task = conv.body.task;
    taskIds.push(task.id);
    expect(task.title).toContain("buy more whiteboards");

    // Provenance recorded + capture marked processed.
    const { data: capRow } = await admin()
      .from("captures")
      .select("converted_task_id, processed")
      .eq("id", captureId)
      .single();
    expect((capRow as { converted_task_id: string }).converted_task_id).toBe(task.id);

    // It's an unscheduled todo → shows in the rail.
    const rail = await api<{ tasks: TaskRow[] }>("/calendar/tasks/unscheduled");
    expect(rail.body.tasks.some((t) => t.id === task.id)).toBe(true);
  });

  test("daily intention autosaves and reloads", async () => {
    const intention = `${E2E_TAG} ship the work tab`;
    const put = await api<{ plan: { intention: string } }>(`/daily-plan/${PLAN_DATE}`, {
      method: "PUT",
      body: JSON.stringify({ intention }),
    });
    expect(put.status).toBe(200);
    expect(put.body.plan.intention).toBe(intention);

    const get = await api<{ plan: { intention: string } | null }>(`/daily-plan/${PLAN_DATE}`);
    expect(get.body.plan?.intention).toBe(intention);
  });

  test("focus: start → active resumes from server time (cross-device); one active session enforced", async () => {
    const started = await api<{ session: FocusRow }>("/focus/start", {
      method: "POST",
      body: JSON.stringify({ kind: "work", duration_seconds: 1500 }),
    });
    expect(started.status, JSON.stringify(started.body)).toBe(201);
    const session = started.body.session;
    focusIds.push(session.id);
    expect(session.status).toBe("running");

    // Cross-device resume: a fresh GET returns the SAME running session + started_at.
    const active = await api<{ session: FocusRow | null }>("/focus/active");
    expect(active.body.session?.id).toBe(session.id);
    expect(active.body.session?.started_at).toBe(session.started_at);

    // One active timer: a second start is rejected.
    const second = await api("/focus/start", {
      method: "POST",
      body: JSON.stringify({ kind: "work", duration_seconds: 1500 }),
    });
    expect(second.status).toBe(409);

    // Clean up so later tests can start their own session.
    const done = await api(`/focus/${session.id}/abandon`, { method: "POST" });
    expect(done.status).toBe(200);
  });

  test("completing a WORK session increments the task's actual_minutes (atomic)", async () => {
    const created = await api<{ task: TaskRow }>("/tasks", {
      method: "POST",
      body: JSON.stringify({ title: e2eSubject("focus-roll"), estimated_minutes: 25, status: "todo" }),
    });
    const task = created.body.task;
    taskIds.push(task.id);
    expect(task.actual_minutes ?? 0).toBe(0);

    // Seed a running work session started 10 min ago (deterministic elapsed).
    const tenMinAgo = new Date(Date.now() - 10 * 60_000).toISOString();
    const { data: seed, error } = await admin()
      .from("focus_sessions")
      .insert({
        started_at: tenMinAgo,
        duration_seconds: 1500,
        kind: "work",
        status: "running",
        task_id: task.id,
      })
      .select("id")
      .single();
    expect(error, error?.message).toBeNull();
    const sessionId = (seed as { id: string }).id;
    focusIds.push(sessionId);

    const complete = await api<{ task_actual_minutes: number | null }>(`/focus/${sessionId}/complete`, {
      method: "POST",
    });
    expect(complete.status).toBe(200);
    expect(complete.body.task_actual_minutes).toBeGreaterThanOrEqual(9);

    const after = await api<{ task: TaskRow }>(`/tasks/${task.id}`);
    expect(after.body.task.actual_minutes ?? 0).toBeGreaterThanOrEqual(9);

    // Idempotent: completing again does not double-count.
    const again = await api<{ task_actual_minutes: number | null }>(`/focus/${sessionId}/complete`, {
      method: "POST",
    });
    expect(again.body.task_actual_minutes).toBeNull();
  });

  test("shutdown rollover moves unfinished tasks to the next day, leaves finished ones", async () => {
    const unfinished = await api<{ task: TaskRow }>("/tasks", {
      method: "POST",
      body: JSON.stringify({ title: e2eSubject("rollover-open"), status: "todo", planned_date: PLAN_DATE, sort_order: 3 }),
    });
    const doneTask = await api<{ task: TaskRow }>("/tasks", {
      method: "POST",
      body: JSON.stringify({ title: e2eSubject("rollover-done"), status: "done", planned_date: PLAN_DATE }),
    });
    taskIds.push(unfinished.body.task.id, doneTask.body.task.id);

    const roll = await api<{ moved: TaskRow[]; next_date: string }>(`/daily-plan/${PLAN_DATE}/rollover`, {
      method: "POST",
    });
    expect(roll.status).toBe(200);
    expect(roll.body.next_date).toBe(NEXT_DATE);
    const movedIds = roll.body.moved.map((t) => t.id);
    expect(movedIds).toContain(unfinished.body.task.id);
    expect(movedIds).not.toContain(doneTask.body.task.id);

    // Unfinished moved (sort_order preserved); done stayed.
    const open = await api<{ task: TaskRow }>(`/tasks/${unfinished.body.task.id}`);
    expect(open.body.task.planned_date).toBe(NEXT_DATE);
    const done = await api<{ task: TaskRow }>(`/tasks/${doneTask.body.task.id}`);
    expect(done.body.task.planned_date).toBe(PLAN_DATE);
  });
});

test.describe("work mode — UI (Prompt 67)", () => {
  const eventIds: string[] = [];

  test.afterAll(async () => {
    if (eventIds.length) await admin().from("calendar_events").delete().in("id", eventIds);
  });

  test("renders the Work page with Plan/Work tabs; view lives in the URL", async ({ page }) => {
    await page.goto("/dashboard/work");
    await expect(page.getByTestId("work-page")).toBeVisible();
    await expect(page.getByTestId("work-tabs")).toBeVisible();
    // Plan is the default; the rail is present.
    await expect(page.getByTestId("task-rail")).toBeVisible();

    // Switch to Work view via the tab → URL carries ?view=work, focus card shows.
    await page.getByTestId("work-tabs").getByRole("link", { name: "Work" }).click();
    await expect(page).toHaveURL(/view=work/);
    await expect(page.getByTestId("focus-card")).toBeVisible();
  });

  test("meetings render as read-only (non-draggable) anchors", async ({ page }) => {
    // Seed a non-time-block calendar event ~1h out (still "today" in CT) — a meeting.
    const start = new Date(Date.now() + 60 * 60_000).toISOString();
    const end = new Date(Date.now() + 120 * 60_000).toISOString();
    const { data, error } = await admin()
      .from("calendar_events")
      .insert({
        external_id: `e2e-meeting-${Date.now()}`,
        title: e2eSubject("meeting"),
        start_at: start,
        end_at: end,
        is_time_block: false,
        all_day: false,
      })
      .select("id")
      .single();
    expect(error, error?.message).toBeNull();
    eventIds.push((data as { id: string }).id);

    await page.goto("/dashboard/work?view=plan");
    const anchor = page.getByTestId("meeting-anchor").first();
    await expect(anchor).toBeVisible();
    // Read-only: it's not a draggable element (only rail tasks/time-blocks move).
    await expect(anchor).not.toHaveAttribute("draggable", "true");
  });

  test("Plan view holds the responsive invariant — no horizontal scroll at 1440/900/390", async ({ page }) => {
    await page.goto("/dashboard/work?view=plan");
    await expect(page.getByTestId("work-page")).toBeVisible();
    for (const width of [1440, 900, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(200);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
    }
  });
});
