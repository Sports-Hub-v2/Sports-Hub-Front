#!/bin/bash
# Sports Hub v2 프로젝트 자동 설치 스크립트 (Linux/macOS)
# 사용법: chmod +x setup.sh && ./setup.sh

set -e  # 에러 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# 설치 경로 설정
INSTALL_PATH=${1:-"sports-hub-v2"}

echo -e "${GREEN}🏈 Sports Hub v2 프로젝트 설치를 시작합니다...${NC}"
echo -e "${BLUE}📍 설치 경로: $INSTALL_PATH${NC}"

# Docker 설치 확인
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker가 설치되지 않았습니다.${NC}"
    echo -e "${YELLOW}   다운로드: https://docs.docker.com/get-docker/${NC}"
    exit 1
else
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✅ Docker 확인됨: $DOCKER_VERSION${NC}"
fi

# Docker Compose 설치 확인
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose가 설치되지 않았습니다.${NC}"
    echo -e "${YELLOW}   설치 방법: https://docs.docker.com/compose/install/${NC}"
    exit 1
else
    if command -v docker-compose &> /dev/null; then
        COMPOSE_VERSION=$(docker-compose --version)
    else
        COMPOSE_VERSION=$(docker compose version)
    fi
    echo -e "${GREEN}✅ Docker Compose 확인됨: $COMPOSE_VERSION${NC}"
fi

# Git 설치 확인
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git이 설치되지 않았습니다.${NC}"
    echo -e "${YELLOW}   설치: sudo apt-get install git (Ubuntu) 또는 brew install git (macOS)${NC}"
    exit 1
else
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✅ Git 확인됨: $GIT_VERSION${NC}"
fi

# 메인 디렉토리 생성
if [ -d "$INSTALL_PATH" ]; then
    echo -e "${YELLOW}⚠️  '$INSTALL_PATH' 디렉토리가 이미 존재합니다.${NC}"
    read -p "덮어쓰시겠습니까? (y/N): " overwrite
    if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ 설치가 취소되었습니다.${NC}"
        exit 1
    fi
    rm -rf "$INSTALL_PATH"
fi

mkdir -p "$INSTALL_PATH"
cd "$INSTALL_PATH"

echo -e "\n${BLUE}📥 백엔드 서비스들을 다운로드합니다...${NC}"

# GitHub 조직의 모든 리포지토리 정의
declare -A repositories=(
    ["backend-auth"]="https://github.com/Sports-Hub-v2/Sports-Hub-Backend-Auth.git"
    ["backend-user"]="https://github.com/Sports-Hub-v2/Sports-Hub-Backend-User.git"
    ["backend-team"]="https://github.com/Sports-Hub-v2/Sports-Hub-Backend-Team.git"
    ["backend-recruit"]="https://github.com/Sports-Hub-v2/Sports-Hub-Backend-Recruit.git"
    ["backend-notification"]="https://github.com/Sports-Hub-v2/Sports-Hub-Backend-Notification.git"
    ["infra"]="https://github.com/Sports-Hub-v2/Sports-Hub-Infra.git"
    ["frontend"]="https://github.com/Sports-Hub-v2/Sports-Hub-Front.git"
)

# 병렬 다운로드를 위한 PID 배열
pids=()
temp_dir=$(mktemp -d)

# 모든 리포지토리를 병렬로 클론
for name in "${!repositories[@]}"; do
    echo -e "  ${CYAN}📦 $name 다운로드 중...${NC}"
    {
        if git clone "${repositories[$name]}" "$temp_dir/$name" --quiet 2>/dev/null; then
            echo -e "    ${GREEN}✅ $name 완료${NC}"
        else
            echo -e "    ${RED}❌ $name 실패${NC}"
        fi
    } &
    pids+=($!)
done

# 모든 다운로드 완료 대기
for pid in "${pids[@]}"; do
    wait $pid
done

# 임시 디렉토리에서 최종 위치로 이동
for name in "${!repositories[@]}"; do
    if [ -d "$temp_dir/$name" ]; then
        mv "$temp_dir/$name" "./$name"
    fi
done

# 임시 디렉토리 정리
rm -rf "$temp_dir"

echo -e "\n${BLUE}⚙️ 환경 설정을 준비합니다...${NC}"

# 환경 설정 파일 확인 및 복사
if [ -f "infra/docker/.env.example" ]; then
    cp "infra/docker/.env.example" "infra/docker/.env"
    echo -e "  ${GREEN}✅ 환경 설정 파일(.env) 생성 완료${NC}"
    
    # 기본 설정값으로 일부 변경 (macOS와 Linux 호환)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' 's/changeme/sportshub_root_2024/g' "infra/docker/.env"
        sed -i '' 's/sportshub123/sportshub_secure_123/g' "infra/docker/.env"
    else
        # Linux
        sed -i 's/changeme/sportshub_root_2024/g' "infra/docker/.env"
        sed -i 's/sportshub123/sportshub_secure_123/g' "infra/docker/.env"
    fi
    
    echo -e "  ${YELLOW}📝 기본 비밀번호가 설정되었습니다.${NC}"
    echo -e "     ${YELLOW}보안을 위해 실제 사용 시 비밀번호를 변경해주세요!${NC}"
else
    echo -e "  ${YELLOW}⚠️  환경 설정 파일을 찾을 수 없습니다.${NC}"
fi

# Node.js 설치 확인 (프론트엔드용)
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "  ${GREEN}✅ Node.js 확인됨: $NODE_VERSION${NC}"
else
    echo -e "  ${YELLOW}⚠️  Node.js가 설치되지 않았습니다. 프론트엔드 실행을 위해 설치를 권장합니다.${NC}"
    echo -e "     ${GRAY}설치: https://nodejs.org/${NC}"
fi

echo -e "\n${GREEN}🎉 설치가 완료되었습니다!${NC}"
echo -e "\n${BLUE}📋 다음 단계:${NC}"
echo -e "  ${NC}1. OAuth 설정 (선택사항):${NC}"
echo -e "     ${GRAY}- infra/docker/.env 파일 열기${NC}"
echo -e "     ${GRAY}- Google/Naver OAuth 클라이언트 ID/Secret 입력${NC}"
echo -e "\n  ${NC}2. 백엔드 서비스 실행:${NC}"
echo -e "     ${YELLOW}cd infra/docker${NC}"
echo -e "     ${YELLOW}docker compose up -d --build${NC}"
echo -e "\n  ${NC}3. 프론트엔드 실행:${NC}"
echo -e "     ${YELLOW}cd frontend${NC}"
echo -e "     ${YELLOW}npm install${NC}"
echo -e "     ${YELLOW}npm run dev${NC}"
echo -e "\n  ${NC}4. 접속 확인:${NC}"
echo -e "     ${GRAY}- 프론트엔드: http://localhost:5173${NC}"
echo -e "     ${GRAY}- API 서비스들: http://localhost:8081~8085/ping${NC}"

echo -e "\n${CYAN}💡 팁: 'docker compose logs -f [서비스명]'으로 로그를 확인할 수 있습니다.${NC}"
echo -e "${CYAN}예시: docker compose logs -f auth-service${NC}"

echo -e "\n${BLUE}🔧 설치 경로: $(pwd)${NC}"

# 실행 권한 추가 안내
if [ ! -x "$0" ]; then
    echo -e "\n${YELLOW}📝 다음에 실행할 때는 다음 명령어를 사용하세요:${NC}"
    echo -e "   ${YELLOW}chmod +x setup.sh && ./setup.sh${NC}"
fi
