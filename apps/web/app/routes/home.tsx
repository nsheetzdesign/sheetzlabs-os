import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Sheetz Labs OS" },
  { name: "description", content: "Founder Operating System" },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">Sheetz Labs OS</h1>
      <p className="mt-4 text-gray-600">Founder Operating System</p>
    </main>
  );
}
