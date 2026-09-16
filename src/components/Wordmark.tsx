/**
 * The mark: MWN set in the display face at semibold, tracked in tight like a
 * stamped monogram, closed by a signal-colour square.
 *
 * The square is drawn rather than typed: a full stop's shape differs from
 * font to font, and this one has to be identical at every size. It is set a
 * little larger than a true full stop so it still reads at navigation size
 * next to capitals, and on hover it turns 45° into the same diamond that
 * separates items in the capability ticker.
 */
const Wordmark = ({ className = "" }: { className?: string }) => (
  <span
    className={`group/mark display inline-flex items-baseline leading-none font-semibold tracking-[-0.05em] ${className}`}
  >
    MWN
    <span
      aria-hidden="true"
      className="inline-block w-[0.21em] h-[0.21em] ml-[0.08em] bg-accent transition-transform duration-500 ease-out-expo group-hover/mark:rotate-45 group-hover/mark:scale-110"
    />
  </span>
);

export default Wordmark;
