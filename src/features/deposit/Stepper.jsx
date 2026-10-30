export default function Stepper({ steps, current }) {
  return (
    <ol className="stepper">
      {steps.map((label, i) => (
        <li
          key={label}
          className={`stepper__item ${i < current ? "is-done" : ""} ${i === current ? "is-current" : ""}`}
        >
          <span>{i < current ? "✓" : i + 1}</span>
          <em>{label}</em>
        </li>
      ))}
    </ol>
  );
}
