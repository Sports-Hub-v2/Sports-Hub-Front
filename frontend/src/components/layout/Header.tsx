// src/components/layout/Header.tsx (?먮뒗 ?ㅼ젣 寃쎈줈)
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { RecruitCategory } from "@/types/recruitPost"; // RecruitCategory Enum ?꾪룷??
const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper function to convert enum value to lowercase string for URL path
  const categoryEnumToPathString = (categoryEnum: RecruitCategory): string => {
    return categoryEnum.toString().toLowerCase();
  };

  return (
    <header className="bg-[#0f1625] py-5 text-white fixed top-0 left-0 right-0 z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          <span className="border-r pr-3 mr-3 text-white">Sport-Hub</span>
        </Link>

        <nav className="flex gap-8 text-white text-base font-sans">
          <Link to={`/${categoryEnumToPathString(RecruitCategory.MERCENARY)}`} className="text-white hover:text-gray-300">용병 목록</Link>
          <Link to={`/${categoryEnumToPathString(RecruitCategory.TEAM)}`} className="text-white hover:text-gray-300">팀 모집</Link>
          <Link to={`/${categoryEnumToPathString(RecruitCategory.MATCH)}`} className="text-white hover:text-gray-300">경기 모집</Link>
          {isLoggedIn && (
            <Link to="/team-manage" className="text-white hover:text-gray-300">팀 관리</Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <button
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-1 rounded text-sm"
                onClick={() => alert("알림센터 기능은 준비중입니다.")}
              >
                알림센터
              </button>
              <Link
                to="/mypage"
                className="text-white hover:underline text-sm tracking-wide"
              >
                {user?.name}
              </Link>
              <button
                className="bg-red-500 hover:bg-red-400 text-white px-4 py-1 rounded text-sm"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-red-500 hover:bg-red-400 text-white px-4 py-1 rounded text-sm"
              >
                로그인              </Link>
              <Link
                to="/signup"
                className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-1 rounded text-sm"
              >
                회원가입              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

