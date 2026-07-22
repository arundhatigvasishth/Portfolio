// Shared rhythmic timing so motion across the site follows one taal cycle
// instead of arbitrary, unrelated fades.

// Teental: a 16 beat rhythmic cycle common to Kathak and Bharatanatyam.
export const BEATS = 16

// Seconds per beat. Roughly a calm, danceable tempo (~112 bpm).
export const BEAT_SECONDS = 0.535

// One full cycle duration in seconds.
export const CYCLE_SECONDS = BEATS * BEAT_SECONDS

// A percussive easing curve: a quick attack on the beat, then a slow decay,
// the way a struck bol rings and fades. Input phase 0..1 around a beat.
export function pulse(phase: number): number {
  const p = ((phase % 1) + 1) % 1
  // sharp rise, exponential-ish fall
  return Math.pow(1 - p, 2.4)
}

// Rhythmic easing for CSS/transform driven motion: eased with slight
// anticipation, shared across reveal animations.
export const rhythmEasing = "cubic-bezier(0.22, 1, 0.36, 1)"
