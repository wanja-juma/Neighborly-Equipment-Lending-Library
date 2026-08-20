import tractorImg from '../assets/tractor-field.jpg'

function ToolsPanel() {
  return (
    <div className="tools-panel">
      <img
        className="tools-panel__photo"
        src={tractorImg}
        alt="A tractor working a field, representing heavy equipment shared within the community"
      />
      <div className="tools-panel__scrim" aria-hidden="true" />
    </div>
  )
}

export default ToolsPanel
