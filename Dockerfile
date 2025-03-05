# 1. Node.js 공식 이미지 사용 (LTS 버전)
FROM node:22

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json과 package-lock.json 복사
COPY package*.json ./

# 4. npm 패키지 설치 (production 모드)
RUN npm install --only=production

# 5. 소스 코드 복사
COPY . .

# 6. 컨테이너 내부 포트 지정
EXPOSE 8008

# 7. 서버 실행
CMD ["node", "src/app.js"]
