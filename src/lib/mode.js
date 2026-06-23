/**
 * mode.js — Single source of truth for adaptive copy.
 * Import getCopy(recovery_status) to get all user-facing strings.
 * NEVER hardcode recovery/AA references in pages — always use this.
 */

const RECOVERY_COPY = {
  appTagline: 'A modern spiritual toolkit for daily recovery.',
  inventoryTitle: 'Nightly Inventory',
  spotCheckTitle: 'Spot Check',
  reflectionTitle: 'Daily Reflection',
  milestoneLabelDefault: 'Sobriety milestone',
  dateFieldLabel: 'Sobriety date',
  dashboardGreeting: 'Keep coming back.',
  inventoryVerb: 'Take Inventory',
  inventoryDesc: 'Reflect on today through a Step 10 nightly inventory',
  spotCheckDesc: 'A quick mid-day pause to check your spiritual condition',
  startDatePlaceholder: 'Enter your sobriety date',
  dayCounterLabel: 'Days Sober',
  heroLabel: 'Days sober',
  streakLabel: 'Day Streak',
  toolkitName: 'Spiritual Toolkit',
  toolkit: 'Spiritual Toolkit',
  gratitudeTitle: 'Gratitude',
  gratitudeDesc: 'Count your blessings and name what you\'re thankful for',
  affirmationsTitle: 'Affirmations',
  affirmationsDesc: 'Declare who you are and who you\'re becoming',
  journalTitle: 'Journal',
  journalDesc: 'Write or scan your handwritten reflections',
  readingsDesc: 'Today\'s spiritual reflection',
};

const GENERAL_COPY = {
  appTagline: 'A modern self-reflection toolkit that learns your patterns.',
  inventoryTitle: 'Evening Review',
  spotCheckTitle: 'Check-In',
  reflectionTitle: 'Daily Reflection',
  milestoneLabelDefault: 'Personal milestone',
  dateFieldLabel: 'Start date',
  dashboardGreeting: "You're doing great.",
  inventoryVerb: 'Start Evening Review',
  inventoryDesc: 'Reflect on your day with guided self-reflection prompts',
  spotCheckDesc: 'A quick mid-day pause to check in with yourself',
  startDatePlaceholder: 'Enter your start date (optional)',
  dayCounterLabel: 'Days Since I Started',
  heroLabel: 'Days since I started',
  streakLabel: 'Day Streak',
  toolkitName: 'Daily Toolkit',
  toolkit: 'Daily Toolkit',
  gratitudeTitle: 'Gratitude',
  gratitudeDesc: 'Name what you\'re grateful for today',
  affirmationsTitle: 'Affirmations',
  affirmationsDesc: 'Write positive statements about yourself',
  journalTitle: 'Journal',
  journalDesc: 'Write or scan your reflections',
  readingsDesc: 'Today\'s reflection to guide your day',
};

/**
 * Returns the full copy object for a given recovery_status.
 * @param {string} recovery_status - "aa" | "general" | undefined
 */
export function getCopy(recovery_status) {
  return recovery_status === 'aa' ? RECOVERY_COPY : GENERAL_COPY;
}

export function isRecovery(recovery_status) {
  return recovery_status === 'aa';
}

export const MILESTONES = [
  { days: 1,    label: '1 Day',    emoji: '🌱' },
  { days: 30,   label: '30 Days',  emoji: '🌿' },
  { days: 60,   label: '60 Days',  emoji: '🌳' },
  { days: 90,   label: '90 Days',  emoji: '🌲' },
  { days: 180,  label: '6 Months', emoji: '⭐' },
  { days: 270,  label: '9 Months', emoji: '🌟' },
  { days: 365,  label: '1 Year',   emoji: '🏆' },
  { days: 730,  label: '2 Years',  emoji: '💎' },
  { days: 1095, label: '3 Years',  emoji: '👑' },
  { days: 1825, label: '5 Years',  emoji: '🎖️' },
  { days: 3650, label: '10 Years', emoji: '🌠' },
  { days: 4015, label: '11 Years', emoji: '✨' },
  { days: 4380, label: '12 Years', emoji: '💫' },
  { days: 5475, label: '15 Years', emoji: '🌠' },
  { days: 7300, label: '20 Years', emoji: '🎆' },
];

export function getCurrentMilestone(days) {
  if (!days || days < 1) return null;
  const reached = MILESTONES.filter(m => days >= m.days);
  return reached.length ? reached[reached.length - 1] : null;
}

export function getNextMilestone(days) {
  if (!days || days < 1) return MILESTONES[0];
  return MILESTONES.find(m => m.days > days) || null;
}