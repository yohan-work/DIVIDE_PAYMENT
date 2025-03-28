"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
// import { v4 as uuidv4 } from "uuid";

interface Person {
  name: string;
  amount: number;
}

export default function ResultPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("receipt-split");
    if (data) {
      setPersons(JSON.parse(data));
    }
  }, []);

  const total = persons.reduce((acc, p) => acc + p.amount, 0);

  const handleShare = async () => {
    if (persons.length === 0) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("receipts")
        .insert([{ data: persons }])
        .select();

      if (error || !data) {
        console.error(error);
        alert("공유 링크 생성에 실패했습니다.");
        return;
      }

      const id = data[0].id;
      const url = `${window.location.origin}/share/${id}`;
      await navigator.clipboard.writeText(url);
      alert("공유 링크가 복사되었습니다!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 py-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-black">📄 정산 결과</h2>

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

      <button
        className="mt-8 w-full bg-black text-white py-3 rounded-xl text-lg hover:bg-gray-900 transition disabled:opacity-50"
        onClick={handleShare}
        disabled={loading}
      >
        {loading ? "공유 중..." : "공유 링크 생성 및 복사"}
      </button>
    </main>
  );
}
