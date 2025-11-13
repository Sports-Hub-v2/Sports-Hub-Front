// src/features/application/api/applicationApi.ts

import axiosInstance from "@/lib/axiosInstance";
import type { MyApplication, ReceivedApplication } from "@/types/application";

// Helper: fetch post title for display
const fetchPostTitle = async (postId: number): Promise<string> => {
  try {
    const res = await axiosInstance.get(`http://localhost:8084/api/recruit/posts/${postId}`)
    return (res.data as any)?.title ?? ''
  } catch {
    return ''
  }
}

// 내 신청 내역 (지원자 프로필 기준)
export const getMyApplicationsByApplicantApi = async (profileId: number): Promise<MyApplication[]> => {
  const res = await axiosInstance.get(`http://localhost:8084/api/recruit/applications/by-applicant/${profileId}`)
  const raw = Array.isArray(res.data) ? res.data : []
  const mapped: MyApplication[] = await Promise.all(raw.map(async (a: any) => ({
    applicationId: a.id,
    status: a.status,
    message: a.description ?? '',
    rejectionReason: null,
    appliedAt: a.applicationDate,
    postId: a.postId,
    postTitle: await fetchPostTitle(a.postId),
  })))
  return mapped
}

// 받은 신청 내역 (작성자 프로필 기준)
export const getReceivedApplicationsApi = async (profileId: number): Promise<ReceivedApplication[]> => {
  const res = await axiosInstance.get(`http://localhost:8084/api/recruit/applications/received/${profileId}`)
  const raw = Array.isArray(res.data) ? res.data : []
  const mapped: ReceivedApplication[] = await Promise.all(raw.map(async (a: any) => ({
    applicationId: a.id,
    postId: a.postId,
    postTitle: await fetchPostTitle(a.postId),
    applicantName: a.applicantProfileId ? `사용자 ${a.applicantProfileId}` : '익명',
    applicantId: a.applicantProfileId || 0,
    applicantProfileId: a.applicantProfileId,
    message: a.description ?? '',
    status: a.status,
    appliedAt: a.applicationDate,
  })))
  return mapped
}

// 승인/거절
export const acceptApplicationApi = async (applicationId: number, postId: number): Promise<string> => {
  await axiosInstance.patch(`http://localhost:8084/api/recruit/posts/${postId}/applications/${applicationId}`, {
    status: 'ACCEPTED'
  })
  return '신청을 승인했습니다.'
}

export const rejectApplicationApi = async (applicationId: number, postId: number): Promise<string> => {
  await axiosInstance.patch(`http://localhost:8084/api/recruit/posts/${postId}/applications/${applicationId}`, {
    status: 'REJECTED'
  })
  return '신청을 거절했습니다.'
}

// 신청 취소 (postId 필요)
export const cancelApplicationApi = async (applicationId: number, postId: number): Promise<void> => {
  await axiosInstance.delete(`http://localhost:8084/api/recruit/posts/${postId}/applications/${applicationId}`)
}

