import type { StructuredSynthesis } from './dayCapture';

export function buildSynthesisPrompt(args: {
	mode: 'single' | 'multi';
	notes: Array<{ createdAt: number; content: string }>;
}) {
	const notesBlock =
		args.mode === 'single'
			? (args.notes[0]?.content ?? '')
			: [
					'The following are timestamped notes the user added throughout their workday.',
					"Synthesize them into a single coherent structured summary as if it were one day's work.",
					'Do not list each note separately - find the themes, consolidate the tasks, infer the skills.',
					'',
					...args.notes.map(
						(note) => `[${formatTime(note.createdAt)}] - ${note.content}`,
					),
				].join('\n');

	return [
		'You are a career journaling assistant. The user will give you raw notes about their workday.',
		'Extract and return ONLY a valid JSON object. No preamble. No markdown fences. No explanation.',
		'',
		notesBlock,
		'',
		'Required schema:',
		JSON.stringify(
			{
				summary: 'one sentence headline of the day',
				tasks_completed: ['concrete deliverable 1', 'concrete deliverable 2'],
				skills_demonstrated: ['skill 1', 'skill 2'],
				impact: 'any impact or outcome mentioned, or null',
				blockers: 'any blockers or challenges, or null',
				tags: ['project name or category tag 1', 'tag 2'],
			},
			null,
			2,
		),
		'',
		'Rules:',
		'- Do not invent facts not stated by the user.',
		'- Infer skills from context: "led standup" -> "leadership", "reviewed PR" -> "code review", "wrote design doc" -> "technical writing", "unblocked a teammate" -> "collaboration"',
		'- Tags should be project names or work categories (e.g. "backend", "onboarding", "Q2 planning", "hiring")',
		'- Return null (not a string) for impact and blockers if not mentioned',
		'- tasks_completed should be specific and action-oriented, not vague',
	].join('\n\n');
}

export function extractTextFromAnthropicResponse(payload: unknown) {
	if (!payload || typeof payload !== 'object') {
		throw new Error('Anthropic returned an invalid response payload.');
	}

	const content = (payload as { content?: unknown }).content;

	if (!Array.isArray(content)) {
		throw new Error('Anthropic response was missing content blocks.');
	}

	const textBlock = content.find(
		(block) =>
			typeof block === 'object' &&
			block !== null &&
			(block as { type?: unknown }).type === 'text' &&
			typeof (block as { text?: unknown }).text === 'string',
	);

	if (!textBlock) {
		throw new Error('Anthropic response did not contain text output.');
	}

	return (textBlock as { text: string }).text.trim();
}

export function parseStructuredSynthesis(
	jsonText: string,
): StructuredSynthesis {
	const parsed = JSON.parse(stripCodeFence(jsonText)) as unknown;

	if (!parsed || typeof parsed !== 'object') {
		throw new Error('Synthesis output must be a JSON object.');
	}

	const candidate = parsed as Record<string, unknown>;
	const summary = normalizeSentence(candidate.summary, 500);
	const tasksCompleted = normalizeStringArray(candidate.tasks_completed);
	const skillsDemonstrated = normalizeStringArray(
		candidate.skills_demonstrated,
	);
	const impact = normalizeNullableString(candidate.impact);
	const blockers = normalizeNullableString(candidate.blockers);
	const tags = normalizeStringArray(candidate.tags);

	if (!summary) {
		throw new Error('Synthesis output must include a summary.');
	}

	return {
		summary,
		tasksCompleted,
		skillsDemonstrated,
		impact,
		blockers,
		tags,
	};
}

function normalizeSentence(value: unknown, maxLength: number) {
	if (typeof value !== 'string') {
		return '';
	}

	return value.trim().replace(/\s+/g, ' ').slice(0, maxLength).trim();
}

function normalizeStringArray(value: unknown) {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.filter((item): item is string => typeof item === 'string')
		.map((item) => item.trim().replace(/\s+/g, ' '))
		.filter(Boolean)
		.slice(0, 8);
}

function normalizeNullableString(value: unknown) {
	if (value === null) {
		return null;
	}

	if (typeof value !== 'string') {
		return null;
	}

	const normalized = value.trim().replace(/\s+/g, ' ');

	return normalized ? normalized : null;
}

function stripCodeFence(value: string) {
	const trimmed = value.trim();

	if (trimmed.startsWith('```')) {
		return trimmed
			.replace(/^```(?:json)?\s*/i, '')
			.replace(/\s*```$/, '')
			.trim();
	}

	return trimmed;
}

function formatTime(timestamp: number) {
	return new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	})
		.format(new Date(timestamp))
		.toLowerCase()
		.replace(' ', '');
}
