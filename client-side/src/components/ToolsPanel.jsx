import gardenToolsImg from '../assets/garden-tools.jpg'

function ToolsPanel() {
  return (
    <div className="tools-panel">
      <img
        className="tools-panel__photo"
        src={gardenToolsImg}
        alt="Gardening and yard equipment laid out on grass, representing tools shared within the community"
      />
      <div className="tools-panel__scrim" aria-hidden="true" />
    </div>
  )
}

export default ToolsPanel
