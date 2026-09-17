/**
 * Mutable transcript component for one contiguous run of tool calls/results.
 * The session log remains authoritative; mutability only lets a pending call
 * settle in place instead of printing a second transcript row.
 */

import type { ToolCallId } from '@deepseek-ai/dsh-llm'
import type { SessionEvent } from '@deepseek-ai/dsh-session'
import type { Component } from '@earendil-works/pi-tui'
import { formatToolActivityGroup, type RenderOptions, type ToolActivityEntry } from '../render.js'
import { padTranscriptText } from './text.js'

export class ToolActivityBlock implements Component {
  private readonly entries: ToolActivityEntry[] = []
  private readonly indexByCallId = new Map<ToolCallId, number>()

  constructor(
    private readonly options: RenderOptions,
    private readonly spinnerChar: () => string,
  ) {}

  append(event: SessionEvent): void {
    if (event.type === 'tool/call') {
      this.indexByCallId.set(event.data.callId, this.entries.length)
      this.entries.push({ call: event, result: undefined })
      return
    }
    if (event.type !== 'tool/result') return
    const index = this.indexByCallId.get(event.data.message.source.callId)
    if (index === undefined) {
      this.entries.push({ call: undefined, result: event })
      return
    }
    this.entries[index] = { ...this.entries[index], result: event }
  }

  invalidate(): void {}

  render(width: number): string[] {
    return padTranscriptText(formatToolActivityGroup(this.entries, this.options, this.spinnerChar()), width)
  }
}
