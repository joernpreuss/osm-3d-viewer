/** Highest pitch MapLibre GL supports. */
export const MAX_PITCH = 85;

/**
 * Normalize a bearing in degrees to [0, 360). MapLibre reports bearings in
 * (-180, 180], which is awkward for display and for stepping animations.
 */
export function normalizeBearing(bearing: number): number {
  return ((bearing % 360) + 360) % 360;
}

/** Clamp a pitch in degrees to the range MapLibre accepts. */
export function clampPitch(pitch: number): number {
  return Math.min(Math.max(pitch, 0), MAX_PITCH);
}
