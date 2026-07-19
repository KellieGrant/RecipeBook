export default function MobilePageHeader({ title, onBack }) {
  return <header className="mobile-page-header">
    <button onClick={onBack} aria-label="Back to recipes">‹ Back</button>
    <strong>{title}</strong>
    <span aria-hidden="true" />
  </header>
}
