#!/usr/bin/env bash
set -euo pipefail

AUTH_BASE=${AUTH_BASE:-http://localhost:8081}
USER_BASE=${USER_BASE:-http://localhost:8082}
TEAM_BASE=${TEAM_BASE:-http://localhost:8083}
RECRUIT_BASE=${RECRUIT_BASE:-http://localhost:8084}
NOTIF_BASE=${NOTIF_BASE:-http://localhost:8085}

post() {
  curl -sS -X POST "$1" \
    -H 'Content-Type: application/json' \
    -d "$2"
}

echo "== Seeding: Accounts =="
u1=$(curl -sS "$AUTH_BASE/api/auth/accounts?email=user1@example.com" || true)
if [ -z "$u1" ]; then
  u1=$(post "$AUTH_BASE/api/auth/accounts" '{"email":"user1@example.com","password":"Secret123!","role":"USER"}')
fi
capt=$(curl -sS "$AUTH_BASE/api/auth/accounts?email=captain@example.com" || true)
if [ -z "$capt" ]; then
  capt=$(post "$AUTH_BASE/api/auth/accounts" '{"email":"captain@example.com","password":"Captain123!","role":"USER"}')
fi

admin=$(curl -sS "$AUTH_BASE/api/auth/accounts?email=admin@example.com" || true)
if [ -z "$admin" ]; then
  admin=$(post "$AUTH_BASE/api/auth/accounts" '{"email":"admin@example.com","password":"Admin123!","role":"ADMIN"}')
fi

u1_id=$(echo "$u1" | jq -r .id)
capt_id=$(echo "$capt" | jq -r .id)
admin_id=$(echo "$admin" | jq -r .id)

echo "== Seeding: Profiles =="
curl -sS "$USER_BASE/api/users/profiles/by-account/$u1_id" >/dev/null || post "$USER_BASE/api/users/profiles" "{\"accountId\":$u1_id,\"name\":\"User One\",\"region\":\"서울\",\"preferredPosition\":\"MF\"}"
curl -sS "$USER_BASE/api/users/profiles/by-account/$capt_id" >/dev/null || post "$USER_BASE/api/users/profiles" "{\"accountId\":$capt_id,\"name\":\"Captain Kim\",\"region\":\"경기\",\"preferredPosition\":\"DF\"}"
curl -sS "$USER_BASE/api/users/profiles/by-account/$admin_id" >/dev/null || post "$USER_BASE/api/users/profiles" "{\"accountId\":$admin_id,\"name\":\"Admin Lee\",\"region\":\"서울\",\"preferredPosition\":\"GK\"}"

echo "== Seeding: Teams =="
t1=$(post "$TEAM_BASE/api/teams" '{"teamName":"Seoul FC","captainProfileId":2,"region":"서울"}')
t1_id=$(echo "$t1" | jq -r .id)
post "$TEAM_BASE/api/teams/$t1_id/members" '{"profileId":1,"roleInTeam":"PLAYER"}' >/dev/null
post "$TEAM_BASE/api/teams/$t1_id/members" '{"profileId":2,"roleInTeam":"CAPTAIN"}' >/dev/null
post "$TEAM_BASE/api/teams/$t1_id/notices" '{"title":"첫 모임 공지","content":"이번 주 토요일 오전 10시 합류"}' >/dev/null

echo "== Seeding: Recruit =="
p1=$(post "$RECRUIT_BASE/api/recruit/posts" '{"teamId":'"$t1_id"',"writerProfileId":2,"title":"연습 경기 용병 구합니다","content":"포지션 무관, 오후 2시","region":"서울","category":"MERCENARY","targetType":"USER","status":"OPEN"}')
pid=$(echo "$p1" | jq -r .id)
post "$RECRUIT_BASE/api/recruit/posts/$pid/applications" '{"applicantProfileId":1,"description":"MF 가능합니다","status":"PENDING"}' >/dev/null

echo "== Seeding: Notifications =="
post "$NOTIF_BASE/api/notifications" '{"receiverProfileId":1,"type":"WELCOME","message":"스포츠허브에 오신 것을 환영합니다!"}' >/dev/null
post "$NOTIF_BASE/api/notifications" '{"receiverProfileId":2,"type":"APPLICATION","message":"새로운 용병 신청이 도착했습니다."}' >/dev/null

echo "Done"

