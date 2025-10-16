// src/types/user.ts

/**
 * ?쒕쾭 ?묐떟 ?먮뒗 ???대??먯꽌 ?ъ슜???ъ슜???뺣낫 ???
 * 諛깆뿏??UserResponseDto.java ? ?꾨뱶 援ъ“瑜??쇱튂?쒗궢?덈떎.
 */
export interface UserResponseDto { // 諛깆뿏??UserResponseDto? ?쇱튂?쒗궗 ???  id: number;
  name: string;
  email: string;
  userid: string; // User.java 諛?UserResponseDto.java 湲곗?
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
 * 湲곗〈 User ?명꽣?섏씠??(UserResponseDto? ?숈씪?섍쾶 ?ъ슜?섍굅??
 * ???대? ?쒗쁽??留욊쾶 ?꾨뱶瑜?異붽?/?쒖쇅?????덉뒿?덈떎.)
 * ?ш린?쒕뒗 UserResponseDto? ?숈씪?섍쾶 ?뺤쓽?⑸땲??
 */
export type User = UserResponseDto;


/**
 * ?뚯썝媛???붿껌 ???쒕쾭濡??꾩넚???곗씠?곗쓽 援ъ“瑜??뺤쓽?섎뒗 ???
 */
export interface UserSignUpRequestDto {
  name: string;
  email: string;
  userid: string; // 諛깆뿏??UserSignUpRequestDto.java??'userid'瑜??ъ슜
  password: string;
  isExPlayer?: boolean;
  region?: string;
  preferredPosition?: string;
  phoneNumber?: string;
}

/**
 * 濡쒓렇???붿껌 DTO.
 * 諛깆뿏??濡쒓렇??DTO??"loginId" ?꾨뱶瑜?湲곕??⑸땲??(?ㅻ쪟 硫붿떆吏 湲곕컲).
 */
export interface UserLoginRequestDto {
  loginId: string; // ??諛깆뿏?쒖뿉??湲곕??섎뒗 ?꾨뱶紐?  password: string;
}

/**
 * ?몄쬆 ?묐떟 DTO.
 * 諛깆뿏?쒖쓽 AuthLoginResponseDto.java 援ъ“? ?쇱튂?쒗궢?덈떎.
 */
export interface AuthResponseDto {
  token: string; // 諛깆뿏??AuthLoginResponseDto.java???꾨뱶紐?'token'
  user: UserResponseDto; // 濡쒓렇????諛섑솚?섎뒗 ?ъ슜???뺣낫
}

export interface UserProfileUpdateDto {
  name?: string;                 // @Size(max = 50)
  email?: string;                // @Email, @Size(max = 100)
  password?: string;             // @Size(max = 255), 蹂댄넻 蹂꾨룄 API ?ъ슜
  isExPlayer?: boolean;          //
  region?: string;               //
  preferredPosition?: string;    //
  phoneNumber?: string;          // @Size(max = 20)
  activityStartDate?: string;    // Java??LocalDate??string?쇰줈
  activityEndDate?: string;      // Java??LocalDate??string?쇰줈
  birthDate?: string;            // Java??LocalDate??string?쇰줈
}

export interface PublicUserProfileResponseDto {
  id: number;
  name: string;
  userid: string; // ?먮뒗 loginId ??諛깆뿏??DTO ?꾨뱶紐낃낵 ?쇱튂
  region?: string;
  preferredPosition?: string;
  isExPlayer?: boolean;
  // 諛깆뿏??PublicUserProfileResponseDto???뺤쓽???ㅻⅨ 怨듦컻 ?꾨뱶??}


