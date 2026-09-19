import type { StyleTokens } from "@salesforce/agentforce-conversation-client";

/**
 * Flat prop surface for {@link AgentforceConversationClient}. Mirrors the
 * fields of `AgentforceClientConfig` (plus embed-time overrides) that this
 * template exposes; everything is optional so the component can be dropped
 * in with just an `agentId`.
 */
export interface AgentforceConversationClientProps {
	/** Agentforce agent id (e.g. "0Xx..."). Required for the embed to do anything useful. */
	agentId?: string;
	/** Display label for the agent in the chat header. */
	agentLabel?: string;
	/** Render inline (caller-provided container) instead of a floating launcher. */
	inline?: boolean;
	headerEnabled?: boolean;
	showHeaderIcon?: boolean;
	width?: string | number;
	height?: string | number;
	styleTokens?: StyleTokens;
	isFileBased?: boolean;
	/** Overrides the resolved Salesforce origin (defaults to `SFDC_ENV`). */
	salesforceOrigin?: string;
	/** Overrides the resolved frontdoor URL (dev-only; defaults to the `/__lo/frontdoor` fetch). */
	frontdoorUrl?: string;
	onReady?: (detail: unknown) => void;
	onError?: (error: unknown) => void;
}
