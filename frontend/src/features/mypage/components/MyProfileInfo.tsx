// src/features/myPage/components/MyProfileInfo.tsx (reconstructed)
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  getProfileByAccountIdApi,
  createProfileApi,
  updateMyProfileApi,
} from "@/features/auth/api/userApi";
import type { User, UserProfileUpdateDto } from "@/types/user";
import { REGIONS } from "@/constants/regions";

const fmt = (v?: string | null) => (v && v.length > 0 ? v : "미입력");
const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString("ko-KR") : "정보 없음";

const MyProfileInfo: React.FC = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 신규 생성 폼
  const [createForm, setCreateForm] = useState({
    name: "",
    region: "",
    preferredPosition: "",
  });

  // 수정 폼
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfileUpdateDto>>({});

  useEffect(() => {
    const run = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProfileByAccountIdApi(user.id);
        setProfile(data);
        setEditData({
          name: data.name,
          region: data.region,
          preferredPosition: data.preferredPosition,
          phoneNumber: data.phoneNumber,
        });
      } catch (e: any) {
        if (e?.response?.status === 404) {
          setProfile(null);
        } else {
          setError("프로필을 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [user]);

  const handleCreate = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!user) return;
    if (!createForm.name.trim()) {
      alert("이름은 필수입니다.");
      return;
    }
    try {
      const created = await createProfileApi({
        accountId: user.id,
        name: createForm.name.trim(),
        region: createForm.region || undefined,
        preferredPosition: createForm.preferredPosition || undefined,
      });
      setProfile(created);
      setEditData({
        name: created.name,
        region: created.region,
        preferredPosition: created.preferredPosition,
        phoneNumber: created.phoneNumber,
      });
      alert("프로필이 생성되었습니다.");
    } catch (e) {
      console.error(e);
      alert("프로필 생성 중 오류가 발생했습니다.");
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    if (!editData.name || editData.name.trim() === "") {
      alert("이름은 필수입니다.");
      return;
    }
    try {
      const updated = await updateMyProfileApi(profile.id, editData);
      setProfile(updated);
      setIsEditing(false);
      alert("프로필이 수정되었습니다.");
    } catch (e) {
      console.error(e);
      alert("프로필 수정 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-500 py-8">정보를 불러오는 중...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  // 프로필이 없으면 생성 폼
  if (!profile) {
    return (
      <div className="max-w-lg">
        <h3 className="text-xl font-semibold mb-4">프로필 만들기</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">이름</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">활동 지역</label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={createForm.region}
              onChange={(e) => setCreateForm({ ...createForm, region: e.target.value })}
            >
              <option value="">선택</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700">선호 포지션</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={createForm.preferredPosition}
              onChange={(e) =>
                setCreateForm({ ...createForm, preferredPosition: e.target.value })
              }
            />
          </div>
          <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded" type="submit">
            생성하기
          </button>
        </form>
      </div>
    );
  }

  // 프로필 표시/수정
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold">기본 정보</h3>
          {isEditing ? (
            <div className="space-x-2">
              <button onClick={handleSave} className="text-sm bg-blue-600 text-white px-3 py-1 rounded">
                저장
              </button>
              <button onClick={() => setIsEditing(false)} className="text-sm bg-gray-200 px-3 py-1 rounded">
                취소
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="text-sm bg-gray-200 px-3 py-1 rounded">
              수정
            </button>
          )}
        </div>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <dt className="font-medium text-gray-500">이름</dt>
            <dd className="mt-1">
              {isEditing ? (
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editData.name || ""}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              ) : (
                fmt(profile.name)
              )}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">이메일</dt>
            <dd className="mt-1">{fmt((user && user.email) || "")}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">권한</dt>
            <dd className="mt-1">{fmt(profile.role)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">전화번호</dt>
            <dd className="mt-1">
              {isEditing ? (
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editData.phoneNumber || ""}
                  onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                />
              ) : (
                fmt(profile.phoneNumber)
              )}
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="text-xl font-semibold border-b pb-2 mb-4">활동 정보</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <dt className="font-medium text-gray-500">활동 지역</dt>
            <dd className="mt-1">
              {isEditing ? (
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={editData.region || ""}
                  onChange={(e) => setEditData({ ...editData, region: e.target.value })}
                >
                  <option value="">선택</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              ) : (
                fmt(profile.region)
              )}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">선호 포지션</dt>
            <dd className="mt-1">
              {isEditing ? (
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editData.preferredPosition || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, preferredPosition: e.target.value })
                  }
                />
              ) : (
                fmt(profile.preferredPosition)
              )}
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="text-xl font-semibold border-b pb-2 mb-4">메타 정보</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <dt className="font-medium text-gray-500">생성일</dt>
            <dd className="text-gray-800 mt-1">{fmtDate(profile.createdAt)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">최근 수정일</dt>
            <dd className="text-gray-800 mt-1">{fmtDate(profile.updatedAt)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default MyProfileInfo;

