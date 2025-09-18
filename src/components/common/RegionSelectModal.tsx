import { REGIONS } from "@/constants/regions"

type Props = {
  onSelect: (region: string) => void
  onClose: () => void
}

const RegionSelectModal: React.FC<Props> = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white w-72 max-h-[80vh] rounded-lg shadow-lg overflow-y-auto">
        <div className="px-4 py-3 border-b text-lg font-semibold">지역 선택</div>
        <ul className="divide-y">
          {REGIONS.map((region) => (
            <li
              key={region}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect(region)}
            >
              {region}
            </li>
          ))}
        </ul>
        <div className="p-3 text-center">
          <button
            onClick={onClose}
            className="mt-2 text-sm text-gray-600 hover:text-gray-900"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegionSelectModal
