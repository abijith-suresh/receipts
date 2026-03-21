<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        question: string;
        children: Snippet;
    }

    let { question, children }: Props = $props();
</script>

<details>
    <summary>{question}</summary>
    <div class="answer">
        {@render children()}
    </div>
</details>

<style>
    details {
        border-bottom: 1px solid var(--color-border);
    }

    details:first-of-type {
        border-top: 1px solid var(--color-border);
    }

    summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.25rem 0;
        font-size: 0.9375rem;
        font-weight: 500;
        color: var(--color-ink);
        cursor: pointer;
        list-style: none;
        gap: 1rem;
    }

    summary::-webkit-details-marker {
        display: none;
    }

    summary::after {
        content: '+';
        font-size: 1.25rem;
        font-weight: 300;
        color: var(--color-muted);
        flex-shrink: 0;
        transition: transform 0.2s ease;
    }

    details[open] > summary::after {
        content: '−';
    }

    .answer {
        padding-bottom: 1.25rem;
        font-size: 0.9375rem;
        line-height: 1.7;
        color: var(--color-ink-2);
    }
</style>
