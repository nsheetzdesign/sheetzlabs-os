/**
 * Prompt 66 — time-boxing data foundation.
 *
 * Exercises the tasks API and the time-block task links end-to-end against the
 * real auth boundary (founder JWT via the shared `api()` helper):
 *  • create a task → reads back; schedule it to a date; link a ticket.
 *  • FK ON DELETE SET NULL: delete the linked ticket → the task survives with a
 *    null ticket_id (the ticket deletion never cascades into the task).
 *  • column allowlist: a client-supplied `id` is ignored, not honored.
 *  • auth: an unauthenticated POST is rejected (401).
 *  • time blocks: a raw block (no task) and a task-linked block both persist.
 *
 * Uses the service-role admin client only for test scaffolding (seed/teardown of
 * the ticket) and to assert persisted FK state — never to fake API behavior.
 */
import { test, expect } from "@playwright/test";
import { api, apiPublic } from "../lib/api";
import { admin } from "../lib/supabase";

const NONEXISTENT_UUID = "00000000-0000-0000-0000-000000000000";

interface TaskRow {
  id: string;
  title: string;
  status: string | null;
  planned_date: string | null;
  estimated_minutes: number | null;
  ticket_id: string | null;
}
interface EventRow {
  id: string;
  title: string;
  is_time_block: boolean | null;
  task_id: string | null;
}

test.describe("tasks API (Prompt 66)", () => {
  const createdTaskIds: string[] = [];
  const createdBlockIds: string[] = [];
  const createdTicketIds: string[] = [];

  test.afterAll(async () => {
    for (const id of createdBlockIds) {
      await api(`/calendar/time-blocks/${id}`, { method: "DELETE" }).catch(() => {});
    }
    for (const id of createdTaskIds) {
      await api(`/tasks/${id}`, { method: "DELETE" }).catch(() => {});
    }
    if (createdTicketIds.length) {
      await admin().from("tickets").delete().in("id", createdTicketIds);
    }
  });

  test("rejects an unauthenticated create (401)", async () => {
    const res = await apiPublic("/tasks", {
      method: "POST",
      body: JSON.stringify({ title: "e2e-should-not-create" }),
    });
    expect(res.status).toBe(401);
  });

  test("create → read back; schedule to a date; column allowlist holds", async () => {
    // Create — include a forged `id` and `completed_at` that the allowlist must drop.
    const createRes = await api<{ task: TaskRow }>("/tasks", {
      method: "POST",
      body: JSON.stringify({
        title: "e2e time-boxing task",
        estimated_minutes: 45,
        status: "backlog",
        id: NONEXISTENT_UUID, // forged — must be ignored
        completed_at: "2020-01-01T00:00:00Z", // server-controlled — must be ignored
      }),
    });
    expect(createRes.status, JSON.stringify(createRes.body)).toBe(201);
    const task = createRes.body.task;
    createdTaskIds.push(task.id);

    expect(task.title).toBe("e2e time-boxing task");
    expect(task.estimated_minutes).toBe(45);
    // Column allowlist: the forged id was NOT honored.
    expect(task.id).not.toBe(NONEXISTENT_UUID);

    // Read back.
    const getRes = await api<{ task: TaskRow }>(`/tasks/${task.id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.task.id).toBe(task.id);

    // Schedule it to a day (the core Sunsama field) + reorder.
    const patchRes = await api<{ task: TaskRow }>(`/tasks/${task.id}`, {
      method: "PATCH",
      body: JSON.stringify({ planned_date: "2026-06-15", sort_order: 2, status: "planned" }),
    });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.task.planned_date).toBe("2026-06-15");
    expect(patchRes.body.task.status).toBe("planned");

    // Filterable list by planned_date returns it.
    const listRes = await api<{ tasks: TaskRow[] }>("/tasks?planned_date=2026-06-15");
    expect(listRes.status).toBe(200);
    expect(listRes.body.tasks.some((t) => t.id === task.id)).toBe(true);
  });

  test("link a ticket, then deleting the ticket SET NULLs the link (FK behavior)", async () => {
    // Seed a ticket (service-role; venture_id nullable).
    const { data: ticket, error } = await admin()
      .from("tickets")
      .insert({ source: "manual", type: "feature", title: "e2e ref ticket" })
      .select("id")
      .single();
    expect(error, error?.message).toBeNull();
    const ticketId = (ticket as { id: string }).id;
    createdTicketIds.push(ticketId);

    // Create a task and link the ticket (plain reference, not a promote).
    const createRes = await api<{ task: TaskRow }>("/tasks", {
      method: "POST",
      body: JSON.stringify({ title: "e2e ticket-linked task", ticket_id: ticketId }),
    });
    expect(createRes.status).toBe(201);
    const task = createRes.body.task;
    createdTaskIds.push(task.id);
    expect(task.ticket_id).toBe(ticketId);

    // Delete the ticket — the task must survive with ticket_id NULLed.
    const del = await admin().from("tickets").delete().eq("id", ticketId);
    expect(del.error, del.error?.message).toBeNull();
    createdTicketIds.splice(createdTicketIds.indexOf(ticketId), 1);

    const after = await api<{ task: TaskRow }>(`/tasks/${task.id}`);
    expect(after.status).toBe(200);
    expect(after.body.task.id).toBe(task.id); // task NOT cascade-deleted
    expect(after.body.task.ticket_id).toBeNull(); // link SET NULL
  });

  test("create a raw time block (no task) and a task-linked block", async () => {
    const start = "2026-06-15T15:00:00.000Z";
    const end = "2026-06-15T16:00:00.000Z";

    // Raw freeform block — no task_id, no account (purely local).
    const rawRes = await api<{ event: EventRow }>("/calendar/time-blocks", {
      method: "POST",
      body: JSON.stringify({ title: "Deep work", start_at: start, end_at: end }),
    });
    expect(rawRes.status, JSON.stringify(rawRes.body)).toBe(200);
    const raw = rawRes.body.event;
    createdBlockIds.push(raw.id);
    expect(raw.is_time_block).toBe(true);
    expect(raw.task_id).toBeNull();
    expect(raw.title).toBe("Deep work");

    // Task-linked block — wraps a task; title copied with the ⏱️ prefix.
    const taskRes = await api<{ task: TaskRow }>("/tasks", {
      method: "POST",
      body: JSON.stringify({ title: "blockable task", estimated_minutes: 30 }),
    });
    expect(taskRes.status).toBe(201);
    const task = taskRes.body.task;
    createdTaskIds.push(task.id);

    const linkedRes = await api<{ event: EventRow }>("/calendar/time-blocks", {
      method: "POST",
      body: JSON.stringify({ task_id: task.id, start_at: start }), // end derived from estimate
    });
    expect(linkedRes.status, JSON.stringify(linkedRes.body)).toBe(200);
    const linked = linkedRes.body.event;
    createdBlockIds.push(linked.id);
    expect(linked.is_time_block).toBe(true);
    expect(linked.task_id).toBe(task.id);
    expect(linked.title).toContain("blockable task");
  });
});
