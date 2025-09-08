// src/types/user.ts

/**
 * 서버 응답 또는 앱 내부에서 사용될 사용자 정보 타입.
 * 백엔드 UserResponseDto.java 와 필드 구조를 일치시킵니다.
 */
export interface UserResponseDto { // 백엔드 UserResponseDto와 일치시킬 타입
  id: number;
  name: string;
  email: string;
  userid: string; // User.java 및 UserResponseDto.java 기준
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
}

/**
 * 기존 User 인터페이스 (UserResponseDto와 동일하게 사용하거나,
 * 앱 내부 표현에 맞게 필드를 추가/제외할 수 있습니다.)
 * 여기서는 UserResponseDto와 동일하게 정의합니다.
 */
export type User = UserResponseDto;


/**
 * 회원가입 요청 시 서버로 전송할 데이터의 구조를 정의하는 타입.
 */
export interface UserSignUpRequestDto {
  name: string;
  email: string;
  userid: string; // 백엔드 UserSignUpRequestDto.java는 'userid'를 사용
  password: string;
  isExPlayer?: boolean;
  region?: string;
  preferredPosition?: string;
  phoneNumber?: string;
}

/**
 * 로그인 요청 DTO.
 * 백엔드 로그인 DTO는 "loginId" 필드를 기대합니다 (오류 메시지 기반).
 */
export interface UserLoginRequestDto {
  loginId: string; // ✅ 백엔드에서 기대하는 필드명
  password: string;
}

/**
 * 인증 응답 DTO.
 * 백엔드의 AuthLoginResponseDto.java 구조와 일치시킵니다.
 */
export interface AuthResponseDto {
  token: string; // 백엔드 AuthLoginResponseDto.java의 필드명 'token'
  user: UserResponseDto; // 로그인 후 반환되는 사용자 정보
}

export interface UserProfileUpdateDto {
  name?: string;                 // @Size(max = 50)
  email?: string;                // @Email, @Size(max = 100)
  password?: string;             // @Size(max = 255), 보통 별도 API 사용
  isExPlayer?: boolean;          //
  region?: string;               //
  preferredPosition?: string;    //
  phoneNumber?: string;          // @Size(max = 20)
  activityStartDate?: string;    // Java의 LocalDate는 string으로
  activityEndDate?: string;      // Java의 LocalDate는 string으로
  birthDate?: string;            // Java의 LocalDate는 string으로
}

export interface PublicUserProfileResponseDto {
  id: number;
  name: string;
  userid: string; // 또는 loginId 등 백엔드 DTO 필드명과 일치
  region?: string;
  preferredPosition?: string;
  isExPlayer?: boolean;
  // 백엔드 PublicUserProfileResponseDto에 정의된 다른 공개 필드들
}

