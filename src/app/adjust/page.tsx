"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

interface Person {
  name: string;
  amount: number;
}

// SearchParams를 가져오는 클라이언트 컴포넌트
function AdjustContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const total = Number(searchParams.get("total"));
  const people = Number(searchParams.get("people"));

  const [persons, setPersons] = useState<Person[]>([]);

  useEffect(() => {
    if (total > 0 && people > 0) {
      const split = Math.floor(total / people);
      const initial = Array.from({ length: people }, (_, i) => ({
        name: `사람 ${i + 1}`,
        amount: split,
      }));
      setPersons(initial);
    }
  }, [total, people]);

  const sum = persons.reduce((acc, p) => acc + p.amount, 0);

  const updatePerson = (index: number, field: keyof Person, value: string) => {
    const updated = [...persons];
    if (field === "amount") {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value;
    }
    setPersons(updated);
  };

  const goToResult = () => {
    localStorage.setItem("receipt-split", JSON.stringify(persons));
    router.push("/result");
  };

  return (
    <main className="min-h-screen bg-white px-4 py-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-black">💰 금액 조정</h2>

      <div className="space-y-4">
        {persons.map((person, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={person.name}
              onChange={(e) => updatePerson(index, "name", e.target.value)}
              className="w-1/2 border-b-2 border-neutral-400 py-2 focus:outline-none text-neutral-800"
            />
            <input
              type="number"
              value={person.amount}
              onChange={(e) => updatePerson(index, "amount", e.target.value)}
              className="w-1/2 border-b-2 border-neutral-400 py-2 text-right focus:outline-none text-neutral-800"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 text-neutral-800 text-sm">
        총합:{" "}
        <span className={sum !== total ? "text-red-500" : "text-green-600"}>
          {sum.toLocaleString()}원
        </span>
        {sum !== total && (
          <span className="text-red-500 ml-2">(총 금액과 일치하지 않음)</span>
        )}
      </div>

      <button
        onClick={goToResult}
        className="mt-8 w-full bg-black text-white py-3 rounded-xl text-lg hover:bg-gray-900 transition"
      >
        다음
      </button>
    </main>
  );
}

// 메인 페이지 컴포넌트에서 Suspense 감싸기
export default function AdjustPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">로딩 중...</div>}>
      <AdjustContent />
    </Suspense>
  );
}
