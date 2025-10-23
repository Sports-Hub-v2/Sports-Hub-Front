import React, { useState } from 'react';
import { X, Save, Users, MapPin, Calendar, Home, Trophy, Shield, AlertCircle } from 'lucide-react';

interface EditTeamModalProps {
  team: {
    id: number;
    name: string;
    region: string;
    subRegion?: string;
    foundedDate: string;
    homeGround?: string;
    teamLevel: string;
    status: 'ACTIVE' | 'INACTIVE' | 'DISBANDED';
    verified: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TeamFormData) => void;
}

export interface TeamFormData {
  name: string;
  region: string;
  subRegion: string;
  foundedDate: string;
  homeGround: string;
  teamLevel: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DISBANDED';
  verified: boolean;
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({
  team,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<TeamFormData>({
    name: team.name,
    region: team.region,
    subRegion: team.subRegion || '',
    foundedDate: team.foundedDate || '',
    homeGround: team.homeGround || '',
    teamLevel: team.teamLevel,
    status: team.status,
    verified: team.verified
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // 팀 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = '팀 이름을 입력해주세요';
    } else if (formData.name.length < 2) {
      newErrors.name = '팀 이름은 2자 이상이어야 합니다';
    } else if (formData.name.length > 50) {
      newErrors.name = '팀 이름은 50자 이하여야 합니다';
    }

    // 지역 검증
    if (!formData.region.trim()) {
      newErrors.region = '지역을 선택해주세요';
    }

    // 창단일 검증
    if (formData.foundedDate) {
      const foundedDate = new Date(formData.foundedDate);
      const today = new Date();
      if (foundedDate > today) {
        newErrors.foundedDate = '창단일은 오늘 이전이어야 합니다';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              팀 정보 편집
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              팀의 기본 정보 및 상태를 수정합니다
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 기본 정보 섹션 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              기본 정보
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  팀 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="예: FC 강남 유나이티드"
                  maxLength={50}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">{formData.name.length}/50</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    창단일
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.foundedDate}
                      onChange={(e) => setFormData({ ...formData, foundedDate: e.target.value })}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.foundedDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.foundedDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.foundedDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    팀 레벨
                  </label>
                  <div className="relative">
                    <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={formData.teamLevel}
                      onChange={(e) => setFormData({ ...formData, teamLevel: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="입문">입문</option>
                      <option value="초급">초급</option>
                      <option value="중급">중급</option>
                      <option value="고급">고급</option>
                      <option value="세미프로">세미프로</option>
                      <option value="프로">프로</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 지역 정보 섹션 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              활동 지역
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주 활동 지역 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.region ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">선택하세요</option>
                  <option value="서울">서울</option>
                  <option value="경기">경기</option>
                  <option value="인천">인천</option>
                  <option value="부산">부산</option>
                  <option value="대구">대구</option>
                  <option value="광주">광주</option>
                  <option value="대전">대전</option>
                  <option value="울산">울산</option>
                  <option value="세종">세종</option>
                  <option value="강원">강원</option>
                  <option value="충북">충북</option>
                  <option value="충남">충남</option>
                  <option value="전북">전북</option>
                  <option value="전남">전남</option>
                  <option value="경북">경북</option>
                  <option value="경남">경남</option>
                  <option value="제주">제주</option>
                </select>
                {errors.region && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.region}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  세부 지역
                </label>
                <input
                  type="text"
                  value={formData.subRegion}
                  onChange={(e) => setFormData({ ...formData, subRegion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 강남구, 분당구"
                />
              </div>
            </div>
          </div>

          {/* 홈구장 정보 섹션 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-orange-600" />
              홈구장
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                홈구장 이름
              </label>
              <input
                type="text"
                value={formData.homeGround}
                onChange={(e) => setFormData({ ...formData, homeGround: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="예: 강남 스포츠파크, 탄천 종합운동장"
              />
              <p className="mt-1 text-xs text-gray-500">주로 활동하는 경기장이나 운동장 이름을 입력하세요</p>
            </div>
          </div>

          {/* 상태 정보 섹션 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              팀 상태
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  활동 상태 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ACTIVE">활성 (정상 활동 중)</option>
                  <option value="INACTIVE">비활성 (일시 중단)</option>
                  <option value="DISBANDED">해체됨</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  인증 상태
                </label>
                <label className="flex items-center gap-3 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">공식 인증 팀</span>
                </label>
                <p className="mt-1 text-xs text-gray-500">활동 실적이 검증된 팀에 체크</p>
              </div>
            </div>
          </div>

          {/* 경고 메시지 */}
          {formData.status === 'DISBANDED' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">팀 해체 상태입니다</p>
                  <p>해체된 팀은 모든 활동이 중단되며, 복구하려면 관리자 승인이 필요합니다.</p>
                </div>
              </div>
            </div>
          )}

          {formData.status === 'INACTIVE' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">비활성 상태입니다</p>
                  <p>비활성 팀은 일부 기능이 제한될 수 있습니다.</p>
                </div>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeamModal;
