// src/types/user.ts

/**
 * 백엔드 UserResponseDto와 일치하는 사용자 정보 타입
 */
export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  userid: string;
  role?: string;
  isExPlayer?: boolean;
  region?: string;
  preferredPosition?: string;
  phoneNumber?: string;
  activityStartDate?: string;
  activityEndDate?: string;
  birthDate?: string;
  createdAt?: string;
  updatedAt?: string;

  // 추가 필드
  height?: number;              // 키 (cm)
  weight?: number;              // 몸무게 (kg)
  bio?: string;                 // 자기소개
  profileImageUrl?: string;     // 프로필 이미지 URL
  dominantFoot?: string;        // 주발 (RIGHT/LEFT/BOTH)
  careerYears?: number;         // 축구 경력 (년)
  playStyle?: string;           // 플레이 스타일
  instagramUrl?: string;        // 인스타그램 URL
  facebookUrl?: string;         // 페이스북 URL
  preferredTimeSlots?: string;  // 선호 시간대
}

/**
 * User 타입 (UserResponseDto와 동일)
 */
export type User = UserResponseDto;

/**
 * 회원가입 요청 DTO
 */
export interface UserSignUpRequestDto {
  name: string;
  email: string;
  userid: string;
  password: string;
  isExPlayer?: boolean;
  region?: string;
  preferredPosition?: string;
  phoneNumber?: string;
}

/**
 * 로그인 요청 DTO
 */
export interface UserLoginRequestDto {
  loginId: string;
  password: string;
}

/**
 * 인증 응답 DTO
 */
export interface AuthResponseDto {
  token: string;
  user: UserResponseDto;
}

/**
 * 프로필 업데이트 DTO
 */
export interface UserProfileUpdateDto {
  name?: string;
  email?: string;
  password?: string;
  isExPlayer?: boolean;
  region?: string;
  preferredPosition?: string;
  phoneNumber?: string;
  activityStartDate?: string;
  activityEndDate?: string;
  birthDate?: string;

  // 추가 필드
  height?: number;
  weight?: number;
  bio?: string;
  profileImageUrl?: string;
  dominantFoot?: string;
  careerYears?: number;
  playStyle?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  preferredTimeSlots?: string;
}

/**
 * 공개 프로필 응답 DTO
 */
export interface PublicUserProfileResponseDto {
  id?: number;
  name: string;
  userid: string;
  region?: string;
  subRegion?: string;
  preferredPosition?: string;
  skillLevel?: string;
  isExPlayer?: boolean;
  phoneNumber?: string;
  birthDate?: string;
  activityStartDate?: string;
  activityEndDate?: string;
  // 추가 공개 정보 (향후 백엔드 추가 예정)
  height?: number;
  weight?: number;
  bio?: string;
  profileImageUrl?: string;
  dominantFoot?: string;
  careerYears?: number;
  playStyle?: string;
  preferredTimeSlots?: string;
}
