# 정적 파일 서빙용 nginx 사용
FROM nginx:alpine

# nginx 설정 복사: 새로고침(/favorites 등) 대응 + /api 를 백엔드 컨테이너로 전달
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물을 nginx 기본 경로로 복사
COPY ./dist /usr/share/nginx/html

# 80포트 오픈
EXPOSE 80

# 기본 엔트리포인트는 nginx 사용
