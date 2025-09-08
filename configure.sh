#!/bin/bash
# Sports Hub v2 환경 설정 자동화 스크립트
# 사용법: ./configure.sh

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${GREEN}⚙️ Sports Hub v2 환경 설정을 시작합니다...${NC}"

# .env 파일 경로 확인
ENV_FILE="infra/docker/.env"
ENV_EXAMPLE="infra/docker/.env.example"

if [ ! -f "$ENV_EXAMPLE" ]; then
    echo -e "${RED}❌ $ENV_EXAMPLE 파일을 찾을 수 없습니다.${NC}"
    echo -e "${YELLOW}   setup.sh를 먼저 실행해주세요.${NC}"
    exit 1
fi

# 기존 .env 백업
if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${BLUE}📁 기존 .env 파일을 백업했습니다.${NC}"
fi

echo -e "\n${BLUE}🔐 데이터베이스 설정${NC}"

# MySQL 루트 비밀번호 생성
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 20 | tr -d "=+/" | cut -c1-16)
echo -e "  ${GREEN}✅ MySQL 루트 비밀번호 자동 생성: $MYSQL_ROOT_PASSWORD${NC}"

# MySQL 사용자 비밀번호 생성
MYSQL_PASSWORD=$(openssl rand -base64 20 | tr -d "=+/" | cut -c1-16)
echo -e "  ${GREEN}✅ MySQL 사용자 비밀번호 자동 생성: $MYSQL_PASSWORD${NC}"

# JWT Secret 생성 (256비트)
JWT_SECRET=$(openssl rand -base64 32)
echo -e "  ${GREEN}✅ JWT Secret 자동 생성${NC}"

echo -e "\n${BLUE}🔑 OAuth 설정${NC}"

# OAuth 설정 입력 받기
echo -e "${YELLOW}Google OAuth 설정 (선택사항, 나중에 수정 가능):${NC}"
read -p "Google Client ID (엔터로 건너뛰기): " GOOGLE_CLIENT_ID
read -p "Google Client Secret (엔터로 건너뛰기): " GOOGLE_CLIENT_SECRET

echo -e "${YELLOW}Naver OAuth 설정 (선택사항, 나중에 수정 가능):${NC}"
read -p "Naver Client ID (엔터로 건너뛰기): " NAVER_CLIENT_ID
read -p "Naver Client Secret (엔터로 건너뛰기): " NAVER_CLIENT_SECRET

# 기본값 설정
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID:-"your-google-client-id"}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET:-"your-google-client-secret"}
NAVER_CLIENT_ID=${NAVER_CLIENT_ID:-"your-naver-client-id"}
NAVER_CLIENT_SECRET=${NAVER_CLIENT_SECRET:-"your-naver-client-secret"}

echo -e "\n${BLUE}📝 .env 파일을 생성합니다...${NC}"

# .env 파일 생성
cat > "$ENV_FILE" << EOF
# MySQL Database Configuration
MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
MYSQL_USER=sportshub
MYSQL_PASSWORD=$MYSQL_PASSWORD

# Timezone
TZ=Asia/Seoul

# Spring DataSource Configuration
SPRING_DATASOURCE_USERNAME=sportshub
SPRING_DATASOURCE_PASSWORD=$MYSQL_PASSWORD

# Database URLs for each service
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/auth_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
USER_DATASOURCE_URL=jdbc:mysql://mysql:3306/user_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
TEAM_DATASOURCE_URL=jdbc:mysql://mysql:3306/team_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
RECRUIT_DATASOURCE_URL=jdbc:mysql://mysql:3306/recruit_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
NOTIFICATION_DATASOURCE_URL=jdbc:mysql://mysql:3306/notification_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC

# JWT Configuration
AUTH_JWT_SECRET=$JWT_SECRET
AUTH_JWT_EXPIRE_MS=900000
AUTH_REFRESH_EXPIRE_MS=604800000

# OAuth2 Configuration
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_NAVER_CLIENT_ID=$NAVER_CLIENT_ID
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_NAVER_CLIENT_SECRET=$NAVER_CLIENT_SECRET

# Success Redirect URL
AUTH_SUCCESS_REDIRECT_URL=http://localhost:5173/oauth/callback
EOF

echo -e "${GREEN}✅ .env 파일이 생성되었습니다!${NC}"

# 파일 권한 설정
chmod 600 "$ENV_FILE"
echo -e "${BLUE}🔒 .env 파일 권한을 600으로 설정했습니다. (보안 강화)${NC}"

echo -e "\n${GREEN}🎉 환경 설정이 완료되었습니다!${NC}"

echo -e "\n${BLUE}📋 생성된 설정:${NC}"
echo -e "  ${CYAN}• MySQL 루트 비밀번호: $MYSQL_ROOT_PASSWORD${NC}"
echo -e "  ${CYAN}• MySQL 사용자 비밀번호: $MYSQL_PASSWORD${NC}"
echo -e "  ${CYAN}• JWT Secret: 자동 생성됨 (256비트)${NC}"
echo -e "  ${CYAN}• OAuth 설정: ${NC}$([ "$GOOGLE_CLIENT_ID" != "your-google-client-id" ] && echo "Google 설정됨" || echo "Google 미설정") / $([ "$NAVER_CLIENT_ID" != "your-naver-client-id" ] && echo "Naver 설정됨" || echo "Naver 미설정")"

echo -e "\n${YELLOW}📝 추가 설정 방법:${NC}"
echo -e "  ${GRAY}• OAuth 설정 변경: nano $ENV_FILE${NC}"
echo -e "  ${GRAY}• 비밀번호 변경: nano $ENV_FILE${NC}"
echo -e "  ${GRAY}• 설정 백업됨: $ENV_FILE.backup.*${NC}"

echo -e "\n${BLUE}🚀 다음 명령어로 서비스를 시작하세요:${NC}"
echo -e "  ${YELLOW}cd infra/docker${NC}"
echo -e "  ${YELLOW}docker compose up -d --build${NC}"

echo -e "\n${CYAN}💡 OAuth 설정 가이드:${NC}"
echo -e "  ${GRAY}• Google: https://console.developers.google.com/${NC}"
echo -e "  ${GRAY}• Naver: https://developers.naver.com/apps/${NC}"
echo -e "  ${GRAY}• 리다이렉트 URI: http://localhost:8081/oauth2/callback/{provider}${NC}"
