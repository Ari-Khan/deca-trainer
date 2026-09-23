"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ExamQuestion, ParsedExam } from "@/utils/examParser";

type Mode = "page" | "buttons" | "scantron";
type Confirmation = "end" | "question";

type ExamSettings = {
	mode: Mode;
	confirmation: Confirmation;
	progression: "automatic" | "manual";
	delay: number;
	showAnswer: boolean;
	showExplanation: boolean;
	showSources: boolean;
};

const defaultSettings: ExamSettings = {
	mode: "page",
	confirmation: "end",
	progression: "automatic",
	delay: 0,
	showAnswer: false,
	showExplanation: false,
	showSources: false,
};

function OptionButton({ question, option, selected, onSelect }: { question: ExamQuestion; option: ExamQuestion["options"][number]; selected: boolean; onSelect: () => void }) {
	return <button onClick={onSelect} className={`text-left border rounded-lg p-4 transition-colors ${selected ? "border-black bg-zinc-100 dark:border-white dark:bg-zinc-800" : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-500"}`}><span className="font-bold mr-3">{option.letter}.</span>{option.text}{question.answer === option.letter ? "" : ""}</button>;
}

export default function ActiveExamPage() {
	const [exam, setExam] = useState<ParsedExam | null>(null);
	const [settings, setSettings] = useState(defaultSettings);
	const [started, setStarted] = useState(false);
	const [current, setCurrent] = useState(0);
	const [answers, setAnswers] = useState<Record<number, string>>({});
	const [complete, setComplete] = useState(false);

	useEffect(() => {
		const saved = sessionStorage.getItem("deca-active-exam");
		if (!saved) return;
		try {
			setExam(JSON.parse(saved) as ParsedExam);
		} catch {
			setExam(null);
		}
	}, []);

	if (!exam) {
		return <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-white dark:bg-black text-black dark:text-white"><p>No exam is loaded.</p><Link href="/dashboard/exams" className="px-8 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black">Back to Exams</Link></div>;
	}

	if (!started) {
		const update = <K extends keyof ExamSettings>(key: K, value: ExamSettings[K]) => setSettings((previous) => ({ ...previous, [key]: value }));
		return (
			<div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-8 py-16 transition-colors duration-500">
				<div className="max-w-3xl mx-auto">
					<Link href="/dashboard/exams" className="inline-flex items-center gap-1 text-sm text-zinc-500 mb-10"><ChevronLeft className="w-4 h-4" /> Back to Exams</Link>
					<p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Exam setup</p>
					<h1 className="text-4xl font-thin mt-2">{exam.name}</h1>
					<p className="text-zinc-500 mt-2">{exam.questions.length} questions found in this PDF.</p>
					<div className="mt-10 space-y-8">
						<fieldset><legend className="text-sm font-bold mb-3">Mode</legend><div className="flex flex-wrap gap-3">{(["page", "buttons", "scantron"] as Mode[]).map((mode) => <button key={mode} onClick={() => update("mode", mode)} className={`px-5 py-3 rounded-full border text-sm capitalize ${settings.mode === mode ? "bg-black text-white dark:bg-white dark:text-black" : "border-zinc-300 dark:border-zinc-700"}`}>{mode}</button>)}</div></fieldset>
						<fieldset><legend className="text-sm font-bold mb-3">Confirmation</legend><div className="flex gap-3">{(["end", "question"] as Confirmation[]).map((value) => <button key={value} onClick={() => update("confirmation", value)} className={`px-5 py-3 rounded-full border text-sm ${settings.confirmation === value ? "bg-black text-white dark:bg-white dark:text-black" : "border-zinc-300 dark:border-zinc-700"}`}>{value === "end" ? "End of exam" : "Per question"}</button>)}</div></fieldset>
						{settings.mode !== "page" && <fieldset><legend className="text-sm font-bold mb-3">Progression</legend><div className="flex gap-3">{(["automatic", "manual"] as const).map((value) => <button key={value} onClick={() => update("progression", value)} className={`px-5 py-3 rounded-full border text-sm capitalize ${settings.progression === value ? "bg-black text-white dark:bg-white dark:text-black" : "border-zinc-300 dark:border-zinc-700"}`}>{value}</button>)}</div></fieldset>}
						<fieldset><legend className="text-sm font-bold mb-3">Answer information</legend><div className="grid grid-cols-2 gap-3 text-sm">{[["showAnswer", "Answer"], ["showExplanation", "Explanation"], ["showSources", "Sources"]].map(([key, label]) => <label key={key} className="flex items-center gap-2"><input type="checkbox" checked={settings[key as keyof ExamSettings] as boolean} onChange={(event) => update(key as keyof ExamSettings, event.target.checked as never)} />{label}</label>)}</div></fieldset>
						<label className="block text-sm font-bold">Delay between questions <input type="range" min="0" max="10000" step="100" value={settings.delay} onChange={(event) => update("delay", Number(event.target.value))} className="w-full mt-3" /><span className="font-normal text-zinc-500">{settings.delay} ms</span></label>
						<button onClick={() => setStarted(true)} className="px-10 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-bold">Start Exam</button>
					</div>
				</div>
			</div>
		);
	}

	const question = exam.questions[current];
	const visibleQuestions = settings.mode === "page" ? [question] : exam.questions;
	const selectAnswer = (number: number, value: string) => setAnswers((previous) => ({ ...previous, [number]: value }));
	const next = () => {
		if (current >= exam.questions.length - 1) setComplete(true);
		else setCurrent((value) => value + 1);
	};

	if (complete) return <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-white dark:bg-black text-black dark:text-white"><h1 className="text-4xl font-thin">Exam complete</h1><Link href="/dashboard/exams" className="px-8 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black">Back to Exams</Link></div>;

	return <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-8 py-12 transition-colors duration-500"><div className="max-w-4xl mx-auto"><div className="flex justify-between items-center mb-10"><Link href="/dashboard/exams" className="inline-flex items-center gap-1 text-sm text-zinc-500"><ChevronLeft className="w-4 h-4" /> Exit</Link><span className="text-sm text-zinc-500">Question {current + 1} of {exam.questions.length}</span></div><div className="flex justify-between mb-8"><button disabled={current === 0} onClick={() => setCurrent((value) => value - 1)} className="px-6 py-3 rounded-full border disabled:opacity-30">Previous</button><button onClick={next} className="px-8 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black">{current === exam.questions.length - 1 ? "Finish" : "Next"}</button></div><div className="space-y-8">{visibleQuestions.map((item) => <section key={item.number} className="space-y-4"><h2 className="text-xl leading-relaxed">{item.number}. {item.text}</h2><div className="grid gap-3 md:grid-cols-2">{item.options.map((option) => <OptionButton key={option.letter} question={item} option={option} selected={answers[item.number] === option.letter} onSelect={() => selectAnswer(item.number, option.letter)} />)}</div>{settings.showAnswer && item.answer && <p className="text-sm text-green-600">Answer: {item.answer}</p>}{settings.showExplanation && item.explanation && <p className="text-sm text-zinc-500">{item.explanation}</p>}</section>)}</div></div></div>;
}