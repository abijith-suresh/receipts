<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        variant?: 'primary' | 'secondary' | 'text';
        href?: string;
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
        class?: string;
        children: Snippet;
        [key: string]: unknown;
    }

    let {
        variant = 'primary',
        href,
        type = 'button',
        disabled = false,
        class: className = '',
        children,
        ...restProps
    }: Props = $props();
</script>

{#if href}
    <a {href} class="btn btn--{variant} {className}" {...restProps}>
        {@render children()}
    </a>
{:else}
    <button {type} {disabled} class="btn btn--{variant} {className}" {...restProps}>
        {@render children()}
    </button>
{/if}

<style>
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.4;
    min-height: 2.75rem;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.12s ease, background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease;
}

/* Primary: ink fill, white text */
.btn--primary {
    border: none;
    background: var(--color-ink);
    color: #fff;
}
.btn--primary:hover:not(:disabled):not([aria-disabled='true']) {
    background: var(--color-brand-strong);
    transform: translateY(-1px);
}
.btn--primary:disabled,
.btn--primary[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

/* Secondary: outline */
.btn--secondary {
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-ink);
}
.btn--secondary:hover:not(:disabled) {
    border-color: var(--color-brand);
    color: var(--color-brand-strong);
}

/* Text: link style */
.btn--text {
    background: none;
    border: none;
    padding: 0;
    min-height: unset;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-brand);
    text-decoration: underline;
    text-underline-offset: 0.15em;
    border-radius: 0;
}
.btn--text:hover:not(:disabled) {
    color: var(--color-brand-strong);
}
</style>
