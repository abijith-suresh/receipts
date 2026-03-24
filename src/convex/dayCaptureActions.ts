'use node';

import { v } from 'convex/values';
import { internal } from './_generated/api';
import { action } from './_generated/server';

import { getCurrentUserInfo } from './lib/auth';
import {
	type DayCaptureSynthesisContext,
	normalizeEntryDate,
} from './lib/dayCapture';
import {
	buildSynthesisPrompt,
	extractTextFromAnthropicResponse,
	parseStructuredSynthesis,
} from './lib/dayCaptureSynthesis';

const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const LOG_PREVIEW_LIMIT = 2_000;

export const synthesizeDayCapture = action({
	args: {
		entryDate: v.string(),
	},
	handler: async (
		ctx,
		args,
	): Promise<{ entryDate: string; noteCount: number }> => {
		const { clerkId } = await getCurrentUserInfo(ctx);
		const entryDate = normalizeEntryDate(args.entryDate);
		const synthesisContext: DayCaptureSynthesisContext = await ctx.runQuery(
			internal.dayCapture.loadSynthesisContext,
			{
				clerkId,
				entryDate,
			},
		);

		if (synthesisContext.noteCount === 0) {
			throw new Error('Add at least one note before generating a summary.');
		}

		const apiKey = process.env.ANTHROPIC_API_KEY;

		if (!apiKey) {
			throw new Error('ANTHROPIC_API_KEY is not configured.');
		}

		const prompt = buildSynthesisPrompt({
			mode: synthesisContext.mode,
			notes: synthesisContext.dayNotes.map(
				(note: { createdAt: number; content: string }) => ({
					createdAt: note.createdAt,
					content: note.content,
				}),
			),
		});
		const structuredData = await requestStructuredSynthesis(prompt, apiKey);

		await ctx.runMutation(internal.dayCapture.saveSynthesizedEntry, {
			clerkId,
			entryDate,
			rawInput: synthesisContext.rawInput,
			structuredData,
			noteCount: synthesisContext.noteCount,
			activeNoteIds: synthesisContext.activeNoteIds,
		});

		return {
			entryDate,
			noteCount: synthesisContext.noteCount,
		};
	},
});

async function requestStructuredSynthesis(prompt: string, apiKey: string) {
	let retryWithJsonInstruction = false;

	for (let attempt = 0; attempt < 2; attempt += 1) {
		const requestBody = {
			model: ANTHROPIC_MODEL,
			max_tokens: 900,
			temperature: 0.2,
			messages: [
				{
					role: 'user',
					content: retryWithJsonInstruction
						? `${prompt}\n\nIMPORTANT: Return ONLY raw JSON. No markdown fences. No text before or after the JSON.`
						: prompt,
				},
			],
		};
		const response = await fetch(ANTHROPIC_API_URL, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'x-api-key': apiKey,
				'anthropic-version': '2023-06-01',
			},
			body: JSON.stringify(requestBody),
		});
		const responseText = await response.text();

		if (!response.ok) {
			console.error('Anthropic request failed', {
				attempt: attempt + 1,
				model: ANTHROPIC_MODEL,
				status: response.status,
				statusText: response.statusText,
				bodyPreview: truncateForLog(responseText),
			});

			throw new Error(
				`Anthropic request failed with status ${response.status}.`,
			);
		}

		let payload: unknown;

		try {
			payload = JSON.parse(responseText) as unknown;
		} catch (error) {
			console.error('Anthropic response JSON parse failed', {
				attempt: attempt + 1,
				model: ANTHROPIC_MODEL,
				status: response.status,
				error: formatError(error),
				bodyPreview: truncateForLog(responseText),
			});

			throw new Error('Anthropic returned an invalid response payload.');
		}

		try {
			const rawModelText = extractTextFromAnthropicResponse(payload);

			return parseStructuredSynthesis(rawModelText);
		} catch (error) {
			console.error('Anthropic synthesis parse failed', {
				attempt: attempt + 1,
				model: ANTHROPIC_MODEL,
				retrying: attempt === 0,
				error: formatError(error),
				response: summarizeAnthropicPayload(payload),
			});

			if (attempt === 0) {
				retryWithJsonInstruction = true;
				continue;
			}

			throw error;
		}
	}

	throw new Error('Unable to synthesize the day right now.');
}

function summarizeAnthropicPayload(payload: unknown) {
	if (!payload || typeof payload !== 'object') {
		return {
			payloadType: typeof payload,
		};
	}

	const candidate = payload as {
		content?: unknown;
		error?: unknown;
		id?: unknown;
		model?: unknown;
		stop_reason?: unknown;
		type?: unknown;
	};
	const contentTypes = Array.isArray(candidate.content)
		? candidate.content
				.map((block) => {
					if (!block || typeof block !== 'object') {
						return null;
					}

					return typeof (block as { type?: unknown }).type === 'string'
						? (block as { type: string }).type
						: null;
				})
				.filter((value): value is string => value !== null)
		: [];

	return {
		id: typeof candidate.id === 'string' ? candidate.id : undefined,
		type: typeof candidate.type === 'string' ? candidate.type : undefined,
		model: typeof candidate.model === 'string' ? candidate.model : undefined,
		stopReason: candidate.stop_reason,
		contentTypes,
		error:
			candidate.error && typeof candidate.error === 'object'
				? candidate.error
				: undefined,
		textPreview: getAnthropicTextPreview(candidate.content),
	};
}

function getAnthropicTextPreview(content: unknown) {
	if (!Array.isArray(content)) {
		return undefined;
	}

	const textParts = content
		.map((block) => {
			if (!block || typeof block !== 'object') {
				return null;
			}

			if ((block as { type?: unknown }).type !== 'text') {
				return null;
			}

			return typeof (block as { text?: unknown }).text === 'string'
				? (block as { text: string }).text
				: null;
		})
		.filter((value): value is string => value !== null);

	if (textParts.length === 0) {
		return undefined;
	}

	return truncateForLog(textParts.join('\n\n'));
}

function truncateForLog(value: string) {
	if (value.length <= LOG_PREVIEW_LIMIT) {
		return value;
	}

	return `${value.slice(0, LOG_PREVIEW_LIMIT)}... [truncated ${value.length - LOG_PREVIEW_LIMIT} chars]`;
}

function formatError(error: unknown) {
	if (error instanceof Error) {
		return `${error.name}: ${error.message}`;
	}

	return String(error);
}
