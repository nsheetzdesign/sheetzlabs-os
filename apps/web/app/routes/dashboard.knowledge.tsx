import { Header } from "~/components/dashboard/Header";
export default function Knowledge() {
  return (
    <div className="flex flex-1 flex-col">
      <Header title="Knowledge" />
      <main className="flex-1 p-6">
        <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-8 text-center">
          <p className="text-sm text-zinc-500">Knowledge — Coming soon</p>
        </div>
      </main>
    </div>
  );
}
