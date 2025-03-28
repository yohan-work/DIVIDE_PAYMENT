"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Tesseract from "tesseract.js";

export default function HomePage() {
  const router = useRouter();
  const [total, setTotal] = useState("");
  const [people, setPeople] = useState(2);
  const [image, setImage] = useState<File | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const runOCR = async () => {
    if (!image) return alert("이미지를 먼저 업로드해주세요.");

    setOcrLoading(true);
    const { data } = await Tesseract.recognize(image, "eng+kor", {
      logger: (m) => console.log(m),
    });

    const text = data.text;
    console.log("OCR TEXT:", text);

    // 개선된 추출 로직
    const lines = text.split("\n");
    let extracted = "";

    for (const line of lines) {
      if (
        line.includes("결제금액") ||
        line.includes("합계") ||
        line.toLowerCase().includes("total")
      ) {
        const matched = line.match(/(\d{1,3}(,\d{3})*|\d+)\s*원?/);
        if (matched) {
          extracted = matched[0].replace(/[^\d]/g, "");
          break;
        }
      }
    }

    if (extracted) {
      setTotal(extracted);
      alert(`인식된 결제 금액: ${Number(extracted).toLocaleString()}원`);
    } else {
      alert("결제 금액을 인식하지 못했어요 😢");
    }

    setOcrLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = parseInt(total, 10);
    if (isNaN(totalAmount) || people < 1) {
      alert("금액과 인원 수를 올바르게 입력해주세요.");
      return;
    }
    router.push(`/adjust?total=${totalAmount}&people=${people}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <h1 className="text-2xl font-semibold mb-6 text-black">
        🧾 영수증 OCR 정산
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <div>
          <label className="block text-neutral-800 mb-1">
            <span className="text-neutral-800 bg-gray-500 px-2 py-2">
              영수증 이미지 업로드
            </span>
          </label>
          <input
            className="text-neutral-800"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <button
            type="button"
            onClick={runOCR}
            disabled={ocrLoading}
            className="mt-2 text-neutral-800 bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300"
          >
            {ocrLoading ? "인식 중..." : "OCR로 금액 인식하기"}
          </button>
        </div>

        <div>
          <label className="block text-neutral-800 mb-1">총 금액 (원)</label>
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="w-full border-b-2 border-neutral-400 focus:border-black outline-none py-2 text-lg"
            required
          />
        </div>

        <div>
          <label className="block text-neutral-800 mb-1">인원 수</label>
          <input
            type="number"
            value={people}
            onChange={(e) => setPeople(parseInt(e.target.value))}
            className="w-full border-b-2 border-neutral-400 focus:border-black outline-none py-2 text-lg"
            min={1}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-xl text-lg hover:bg-gray-900 transition"
        >
          다음
        </button>
      </form>
    </main>
  );
}
