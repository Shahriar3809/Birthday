// Purely decorative corner badge. `corner` = 'left' | 'right' (defaults left).
// Uses `position: fixed` — keep it OUTSIDE any transformed ancestor in App.jsx
// or fixed anchoring to the viewport breaks.
export default function BrandBadge({ label = 'Shanta ❤', corner = 'left' }) {
  return (
    <div
      aria-hidden
      className={`fixed top-4 z-50 select-none rounded-full border border-rose-300/25 bg-maroon-800/60 px-4 py-2 font-display text-sm italic text-blush-100/90 shadow-lg backdrop-blur-md sm:text-base ${
        corner === 'right' ? 'right-4' : 'left-4'
      }`}
    >
      {label}
    </div>
  )
}
