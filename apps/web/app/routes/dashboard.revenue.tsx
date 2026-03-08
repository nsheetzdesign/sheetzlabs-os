import { Header } from "~/components/dashboard/Header";
export default function Revenue() {
  return (
    <div className="flex flex-1 flex-col">
      <Header title="Revenue" />
      <main className="flex-1 p-6">
        <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-8 text-center">
          <p className="text-sm text-zinc-500">Revenue — Coming soon</p>
        </div>
      </main>
    </div>
  );
}
