// scr/features/mercenary/components/MercenaryApplyForm.tsx
/*import React, { useState } from 'react';
import { applyMercenary, MercenaryRequest } from '../api/mercenaryApi';

const MercenaryApplyForm = () => {
    const [recruitPostId, setRecruitPostId] = useState('');
    const [position, setPosition] = useState('');
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const dto: MercenaryRequest = {
            recruitPostid: Number(recruitPostId),
            position,
            message,
        };

        try {
            const res = await applyMercenary(dto);
            setResponse(res);
            alert('신청 완료!');
        } catch (err) {
            console.error('신청 실패:', err);
            alert('신청 중 오류 발생');
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <h3>용병 신청</h3>
            <input
                type="number"
                placeholder="모집글 ID"
                value={recruitPostId}
                onChange={(e) => setRecruitPostId(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="포지션"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
            />
            <textarea
                placeholder="메시지"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">신청</button>

            {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        </form>
    );
};

export default MercenaryApplyForm;*/