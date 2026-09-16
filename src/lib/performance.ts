/*
 * Device capability, so the page can spend less on hardware that cannot keep up.
 *
 * The signal is a static hint known before anything renders: very few CPU
 * cores, very little memory, or the visitor has Data Saver switched on. On such
 * a device the page runs in "lite" mode: native scrolling instead of Lenis and
 * no continuous, purely decorative scroll effects.
 *
 * A runtime switch based on measured frame pacing was tried and removed: under
 * benchmark it tripped on capable-but-busy frames and made scrolling measurably
 * worse (53.7fps -> 41.3fps at a 4x CPU throttle), so the static hint alone
 * decides.
 */

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

export const LITE_CLASS = "perf-lite";

export const isLowPowerDevice = () => {
  if (typeof navigator === "undefined") return false;
  const n = navigator as NavigatorWithHints;
  const fewCores = typeof n.hardwareConcurrency === "number" && n.hardwareConcurrency <= 2;
  const lowMemory = typeof n.deviceMemory === "number" && n.deviceMemory <= 2;
  return fewCores || lowMemory || !!n.connection?.saveData;
};

export const isLiteMode = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains(LITE_CLASS);

export const enableLiteMode = () => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.add(LITE_CLASS);
};
