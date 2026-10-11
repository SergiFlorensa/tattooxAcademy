type Direction = "diagonal" | "right" | "down" | "left" | "up";

const rotation: Record<Direction, number> = {
  diagonal: 0,
  right: 45,
  down: 135,
  left: 225,
  up: -45,
};

// An open orbit and a precise needle: one signature for every navigation action.
export default function ActionIcon({ direction = "diagonal" }: { direction?: Direction }) {
  return <svg className="icon action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <g transform={`rotate(${rotation[direction]} 12 12)`}>
      <path className="action-icon-orbit" d="M20.5 14.8A9 9 0 1 1 9.2 3.5" opacity=".5" />
      <path className="action-icon-needle" d="m8 16 11-11m-6 0h6v6" />
      <circle cx="6" cy="18" r="1" fill="currentColor" stroke="none" />
    </g>
  </svg>;
}
