// src/features/mercenary/api/mercenaryApi.ts
/*import axiosInstance from "@/lib/axiosInstance.ts"; // axiosInstance 설정된 axios 인스턴트, 미리 설정된 axios 인스턴트를 가져옴 -> 토큰 자동 주입 가능

export interface MercenaryRequest{ // 요구하는 데이터(객체의 타입) 정의
    recruitPostid: number;
    position: string;
    message: string;
}

export const applyMercenary = async(data: MercenaryRequest) => {
    try {
        const response = await axiosInstance.post('/mercenary-application/', data);
        return response.data;
    } catch (error) {
        console.error('용병 신청 실패:', error);
        throw error;
    }
};*/