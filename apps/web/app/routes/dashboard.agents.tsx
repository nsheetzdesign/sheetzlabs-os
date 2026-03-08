import { Header } from "~/components/dashboard/Header";
export default function Agents() {
  return (
    <div className="flex flex-1 flex-col">
      <Header title="AI Agents" />
      <main className="flex-1 p-6">
        <div className="rounded-xl border border-surface-2/50 bg-surface-1/40 p-8 text-center">
          <p className="text-sm text-zinc-500">AI Agents — Coming soon</p>
        </div>
      </main>
    </div>
  );
}
