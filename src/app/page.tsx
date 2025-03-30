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
  const [ocrText, setOcrText] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const runOCR = async () => {
    if (!image) return alert("이미지를 먼저 업로드해주세요.");

    setOcrLoading(true);

    try {
      // Tesseract OCR 실행
      const { data } = await Tesseract.recognize(image, "eng+kor", {
        logger: (m) => console.log(m),
      });

      const text = data.text;
      setOcrText(text); // 전체 OCR 텍스트 저장
      console.log("OCR TEXT:", text);

      // 개선된 추출 로직
      const lines = text.split("\n");
      let extracted = "";

      // 금액 추출을 위한 정규식 패턴 개선
      const amountRegex =
        /(?:합계|총액|결제금액|금액|총합계|총|합|계)?\s*(?::|：)?\s*([\d,]+)\s*원?/i;
      const standAloneAmountRegex = /([\d,]{4,})\s*원/;

      // 첫 번째 시도: 특정 키워드와 함께 있는 금액 추출
      for (const line of lines) {
        if (
          line.includes("결제금액") ||
          line.includes("합계") ||
          line.includes("금액") ||
          line.toLowerCase().includes("total") ||
          line.includes("총") ||
          line.includes("계")
        ) {
          // 쉼표가 포함된 금액을 찾습니다 (예: 5,000)
          const matched =
            line.match(amountRegex) ||
            line.match(/(\d{1,3}(,\d{3})+|\d{4,})\s*원?/);
          if (matched && matched[1]) {
            // 숫자만 추출
            extracted = matched[1].replace(/[^\d]/g, "");
            console.log("금액 추출(1차):", extracted, "원래 텍스트:", line);
            break;
          }
        }
      }

      // 두 번째 시도: 첫번째 시도에서 금액을 찾지 못한 경우 모든 줄에서 검색
      if (!extracted) {
        for (const line of lines) {
          // 금액 형식(4자리 이상 숫자 + '원')을 찾습니다
          const matched = line.match(standAloneAmountRegex);
          if (matched && matched[1]) {
            extracted = matched[1].replace(/[^\d]/g, "");
            console.log("금액 추출(2차):", extracted, "원래 텍스트:", line);
            break;
          }
        }
      }

      // 세 번째 시도: 4자리 이상의 숫자 찾기
      if (!extracted) {
        for (const line of lines) {
          const matched = line.match(/(\d{4,})/);
          if (matched) {
            extracted = matched[1];
            console.log("금액 추출(3차):", extracted, "원래 텍스트:", line);
            break;
          }
        }
      }

      // 금액이 추출되었고 금액이 너무 작은 경우(예: 5) 보정 시도
      if (extracted && parseInt(extracted, 10) < 100) {
        // 받은 이미지가 영수증이라면, 수천원 단위 이상일 가능성이 높음
        // 1,000배 증가시켜 보정 시도
        const adjustedAmount = parseInt(extracted, 10) * 1000;

        if (
          confirm(
            `인식된 금액(${extracted}원)이 너무 작습니다. ${adjustedAmount.toLocaleString()}원으로 보정할까요?`
          )
        ) {
          extracted = adjustedAmount.toString();
        }
      }

      if (extracted) {
        setTotal(extracted);
        alert(`인식된 결제 금액: ${Number(extracted).toLocaleString()}원`);
      } else {
        alert("결제 금액을 인식하지 못했어요 😢 직접 입력해주세요.");
      }
    } catch (error) {
      console.error("OCR 오류:", error);
      alert("이미지 인식 중 오류가 발생했습니다.");
    } finally {
      setOcrLoading(false);
    }
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
            <span className="text-neutral-800 bg-gray-200 px-2 py-1 rounded">
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

          {ocrText && (
            <div className="mt-2 text-xs text-gray-500 border p-2 max-h-24 overflow-auto">
              <p className="font-bold">인식된 텍스트 미리보기:</p>
              <pre>{ocrText.substring(0, 200)}...</pre>
            </div>
          )}
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
