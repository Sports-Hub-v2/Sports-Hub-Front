// src/features/mercenary/api/mercenaryApplyApi.ts
import axiosInstance from "@/lib/axiosInstance.ts";  // axiosInstance 설정된 axios 인스턴트, 미리 설정된 axios 인스턴트를 가져옴 -> 토큰 자동 주입 가능
import {ApplicationRequestDto} from "@/types/application.ts";

const API_BASE_URL = "/api/recruit-posts";

export interface MercenaryRequest{ // 요구하는 데이터(객체의 타입) 정의
    message: string; // 메시지
}

export const applyMercenary = async (postid: number, payload: ApplicationRequestDto) => {
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}/${postid}/apply`, payload); // HTTP POST 요청을 특정 경로로 보냄, await을 사용하여 이 요청이 만료될 때 까지 기다림.
        return response.data;
    } catch (error) {
        console.error('용병 신청 실패:', error);
        throw error;
    }
};