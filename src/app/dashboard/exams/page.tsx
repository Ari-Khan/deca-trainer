"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { parseExamText } from "@/utils/examParser";

async function readPdf(file: File) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  const document = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => ("str" in item ? item.str : "")).join("\n"));
  }

  return pages.join("\n");
}

export default function ExamsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.removeItem("deca-exams");
  }, []);

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsReading(true);
    try {
      const text = await readPdf(file);
      const exam = parseExamText(text, file.name);
      if (!exam.questions.length) {
        throw new Error("No multiple-choice questions were found in this PDF.");
      }
      sessionStorage.setItem("deca-active-exam", JSON.stringify(exam));
      router.push("/dashboard/exams/active");
    } catch (readError) {
      setError(readError instanceof Error ? readError.message : "Unable to read this PDF.");
    } finally {
      setIsReading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-12 pt-32 pb-8 transition-colors duration-500">
      <div className="max-w-5xl mx-0">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-500 mb-6">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-3xl font-thin tracking-tight">Exams</h1>
        <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={handleFileSelected} />
        <button onClick={() => fileInputRef.current?.click()} disabled={isReading} className="px-10 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-bold transition-colors duration-300 mt-5 mb-5 disabled:opacity-50">
          {isReading ? "Reading PDF..." : "Add New Exam"}
        </button>
        {error && <p className="text-sm text-red-500 mb-5">{error}</p>}
        <div className="mt-10 space-y-6">
          {["BUSINESS ADMINISTRATION CORE", "BUSINESS MANAGEMENT + ADMINISTRATION", "ENTREPRENEURSHIP", "FINANCE", "HOSPITALITY + TOURISM", "MARKETING"].map((category) => (
            <section key={category}><h2 className="text-2xl font-thin border-b border-black dark:border-white pb-1">{category}</h2></section>
          ))}
        </div>
      </div>
    </div>
  );
}
