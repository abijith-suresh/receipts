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

const ANTHROPIC_MODEL = 'claude-3-5-haiku-latest';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

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
		const response = await fetch(ANTHROPIC_API_URL, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'x-api-key': apiKey,
				'anthropic-version': '2023-06-01',
			},
			body: JSON.stringify({
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
			}),
		});

		if (!response.ok) {
			throw new Error(
				`Anthropic request failed with status ${response.status}.`,
			);
		}

		const payload = (await response.json()) as unknown;

		try {
			return parseStructuredSynthesis(
				extractTextFromAnthropicResponse(payload),
			);
		} catch (error) {
			if (attempt === 0) {
				retryWithJsonInstruction = true;
				continue;
			}

			throw error;
		}
	}

	throw new Error('Unable to synthesize the day right now.');
}
