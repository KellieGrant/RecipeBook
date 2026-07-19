export default function SettingsPage({ settings, onChange, onReset }) {
  const set = (key, value) => onChange({ ...settings, [key]: value })
  return <div className="main-span"><section className="content-page settings-page">
    <div className="page-title"><div><span className="eyebrow">Make it yours</span><h1>Settings</h1><p>These preferences stay on this device.</p></div></div>
    <div className="settings-card">
      <label><span><strong>Your name</strong><small>Shown in the sidebar profile</small></span><input value={settings.name} onChange={(event) => set('name', event.target.value)} /></label>
      <label><span><strong>Dark mode</strong><small>Use a darker palette throughout RecipeBook</small></span><input type="checkbox" checked={settings.darkMode} onChange={(event) => set('darkMode', event.target.checked)} /></label>
      <label><span><strong>Compact recipe cards</strong><small>Fit more recipes in the list</small></span><input type="checkbox" checked={settings.compact} onChange={(event) => set('compact', event.target.checked)} /></label>
      <label><span><strong>Show recipe images</strong><small>Display food photos in recipe cards</small></span><input type="checkbox" checked={settings.showImages} onChange={(event) => set('showImages', event.target.checked)} /></label>
    </div>
    <div className="danger-zone"><div><strong>Reset local data</strong><p>Restore the sample recipes and default settings.</p></div><button onClick={onReset}>Reset everything</button></div>
  </section></div>
}
