import { useNavigate } from "react-router-dom"

type Props = {
  id: number
  name: string
  intro: string
  region: string
  imageUrl: string
}

const TeamListItem = ({ id, name, intro, region, imageUrl }: Props) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/team/${id}`)}
      className="flex items-center gap-8 px-8 py-6 border-b hover:bg-gray-100 cursor-pointer"
    >
      {/* 훨씬 큰 썸네일 */}
      <img
        src={imageUrl}
        alt={name}
        className="w-24 h-24 rounded-xl object-cover"
      />

      <div className="flex-1 min-w-0">
        <h3 className="text-2xl font-bold text-gray-900 truncate">{name}</h3>
        <p className="text-lg text-gray-700 mt-2 truncate">{intro}</p>
        <span className="text-base text-gray-500">{region}</span>
      </div>
    </div>
  )
}

export default TeamListItem
