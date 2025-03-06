# 1. Node.js LTS 공식 이미지 사용 (slim 버전 사용하여 이미지 크기 최적화)
FROM node:20-slim

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json과 package-lock.json을 먼저 복사하여 캐싱 활용
COPY package*.json ./

# 4. npm 패키지 설치 (캐싱 최적화)
RUN npm config set registry https://registry.npmjs.org/ \
    && npm cache clean --force \
    && npm install --omit=dev

# 5. 소스 코드 복사
COPY . .

# 6. 컨테이너 내부 포트 지정
EXPOSE 8008

# 7. 서버 실행
CMD ["node", "src/app.js"]