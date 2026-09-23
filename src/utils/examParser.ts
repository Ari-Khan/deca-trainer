export type ExamOption = {
	letter: "A" | "B" | "C" | "D";
	text: string;
};

export type ExamQuestion = {
	number: number;
	text: string;
	options: ExamOption[];
	answer?: "A" | "B" | "C" | "D";
	answerText?: string;
	explanation?: string;
	sources: string[];
};

export type ParsedExam = {
	id: string;
	name: string;
	text: string;
	questions: ExamQuestion[];
	createdAt: string;
};

const optionPattern = /(?:^|\n)\s*([A-D])\.\s*([\s\S]*?)(?=\n\s*[A-D]\.\s|$)/g;
const questionPattern = /(?:^|\n)\s*(\d{1,3})\.\s+([\s\S]*?)(?=\n\s*\d{1,3}\.\s+|$)/g;

function cleanText(value: string) {
	return value.replace(/\s+/g, " ").trim();
}

function parseAnswerKey(answerText: string) {
	const answers = new Map<number, Omit<ExamQuestion, "number" | "text" | "options" | "sources">>();
	const answerPattern = /(?:^|\n)\s*(\d{1,3})\.\s*([A-D])\s*([\s\S]*?)(?=\n\s*\d{1,3}\.\s*[A-D]\b|$)/g;

	for (const match of answerText.matchAll(answerPattern)) {
		const detail = match[3].trim();
		const sources = [...detail.matchAll(/SOURCE:\s*(.*?)(?=\s+SOURCE:|$)/gi)].map((source) => cleanText(source[1]));
		const withoutSources = detail.replace(/SOURCE:\s*[\s\S]*$/gi, "").trim();
		const explanation = withoutSources ? cleanText(withoutSources) : undefined;
		answers.set(Number(match[1]), {
			answer: match[2] as ExamQuestion["answer"],
			answerText: undefined,
			explanation,
		});
	}

	return answers;
}

export function parseExamText(text: string, name: string): ParsedExam {
	const questionSection = text.split(/EXAM\s*1/i)[1]?.split(/EXAM[-\s]?KEY\s*\d*/i)[0] ?? text;
	const answerSection = text.match(/EXAM[-\s]?KEY\s*\d*([\s\S]*)/i)?.[1] ?? "";
	const answerKey = parseAnswerKey(answerSection);
	const questions: ExamQuestion[] = [];

	for (const match of questionSection.matchAll(questionPattern)) {
		const number = Number(match[1]);
		const block = match[2].trim();
		const options = [...block.matchAll(optionPattern)].map((option) => ({
			letter: option[1] as ExamOption["letter"],
			text: cleanText(option[2]),
		}));

		if (options.length < 2) continue;

		const questionText = cleanText(block.slice(0, block.search(/(?:^|\n)\s*A\.\s/im)));
		questions.push({
			number,
			text: questionText,
			options,
			...answerKey.get(number),
			sources: answerKey.get(number)?.explanation ? [] : [],
		});
	}

	return {
		id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
		name,
		text,
		questions,
		createdAt: new Date().toISOString(),
	};
}