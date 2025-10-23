import {useParams} from "react-router-dom";
import {useState} from "react";
import {applyMercenary} from "@/features/mercenary/api/mercenaryApplyApi.ts";
//import {MercenaryCard} from "@/features/mercenary/components/MercenaryCard.tsx";
const MercenaryApplyPage = () => {
    const {id} = useParams(); // 게시글 ID
    const [message, setMessage] = useState(""); // 리액트에서 setmessage는 리액트에서 useState를 통해 자동 업데이트를 해주는 함수임.

    const handleSubmit = async() => { // handleSumbit 프론트엔드에서 백엔드로 실제 요청을 보내는 부분
        if(!id) return alert("모집된 ID가 없습니다.");

        try {
            await applyMercenary(
                Number(id),
                {message});
            alert("신청이 완료되었습니다!");
            // navigate("mypage"); // 신청 완료 후 이동도 가능
        }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (error){
            alert("신청 중 오류가 발생했습니다.");
        }
    };

    return(
        <div className="max-w-x1 mx -auto p-4">
            <h1 className="text-2xl font-bold mb-4">⚔️{id}번 모집글에 용병 신청하기</h1>

            <textarea
                placeholder="간단한 자기소개와 포지션을 입력하세요."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-32 p-2 border rounded"
            />

            <button
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                신청하기
            </button>
        </div>

    );
};

export default MercenaryApplyPage;