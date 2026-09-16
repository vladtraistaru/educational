export default function FormulaText({ formula }: { formula: string }) {
  const parts = formula.match(/[A-Z][a-z]?|\d+/g) ?? [];
  return (
    <span>
      {parts.map((part, i) => (/\d/.test(part) ? <sub key={i}>{part}</sub> : <span key={i}>{part}</span>))}
    </span>
  );
}
