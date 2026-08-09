// ============================================================
// ✏️ EDIT ME — Shanta's birthday.
// `month` is 0-indexed, so 7 = August. Uses the device's real
// local date — nothing is hardcoded for "today".
//
// hour: 0-23 (24-hour format). minute: 0-59.
// টেস্ট করার সময় hour/minute বদলে এখন থেকে কয়েক মিনিট পরের
// সময় বসিয়ে দ্রুত চেক করে নিতে পারো, আসল দিন এলে আবার
// month/day/hour/minute ঠিক করে দিও (সাধারণত hour: 0, minute: 0
// মানে ঠিক রাত ১২টায় খুলে যাবে)।
// ============================================================
export const BIRTHDAY = { month: 7, day: 13, hour: 0, minute: 0 }

// Exact target moment (local time) of this year's birthday.
export function getBirthdayTarget(now) {
  return new Date(
    now.getFullYear(),
    BIRTHDAY.month,
    BIRTHDAY.day,
    BIRTHDAY.hour,
    BIRTHDAY.minute,
    0
  )
}

// True when `now` is at or past the target moment.
export function isBirthdayReached(now) {
  return getBirthdayTarget(now) - now <= 0
}