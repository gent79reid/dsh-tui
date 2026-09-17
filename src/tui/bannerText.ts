/** Compact session heading at the top of the transcript. */

import { truncate } from '../render.js'
import { theme, fg } from './theme.js'

export interface BannerContent {
  readonly version: string
  readonly provider: string
  readonly model: string
  readonly cwd: string // already `~`-abbreviated by the caller
}

const bold = (s: string): string => `\x1b[1m${s}\x1b[0m`

const dim = fg(theme.muted)
const primary = fg(theme.primary)

/**
 * Keeps startup identity visible without spending a large permanent block of
 * the scrollback on logo art. Font and line height remain terminal-owned.
 */
export function buildBannerText(content: BannerContent, columns: number): string {
  const width = Math.max(1, columns - 4)
  const identity = `${bold(primary('dsh-tui'))}${dim(` v${content.version} · ${content.provider}/${content.model}`)}`
  return `${identity}\n${dim(truncate(content.cwd, width))}\n`
}
