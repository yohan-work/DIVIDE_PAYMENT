import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("receipts")
    .select()
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const persons = data.data as { name: string; amount: number }[];
  const total = persons.reduce((acc, p) => acc + p.amount, 0);

  return (
    <main className="min-h-screen bg-white px-4 py-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-black">
        🔗 공유된 정산 결과
      </h2>
      <div className="space-y-3">
        {persons.map((person, idx) => (
          <div
            key={idx}
            className="flex justify-between border-b pb-2 text-lg text-neutral-800"
          >
            <span>{person.name}</span>
            <span>{person.amount.toLocaleString()}원</span>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right text-neutral-800 font-medium">
        총합:{" "}
        <span className="text-black text-xl">{total.toLocaleString()}원</span>
      </div>
    </main>
  );
}
