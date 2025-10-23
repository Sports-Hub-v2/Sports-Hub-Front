type Props = {
    selected: string
    onClick: () => void
  }
  
  const RegionSelectTrigger: React.FC<Props> = ({ selected, onClick }) => {
    return (
      <button
        onClick={onClick}
        className="border px-3 py-1 rounded text-sm hover:bg-slate-100"
      >
        {selected}
      </button>
    )
  }
  
  export default RegionSelectTrigger
  