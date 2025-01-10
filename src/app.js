const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const bodyParser = require("body-parser");
// const dbConnect = require("./config/dbConnect");
// const expressLayouts = require("express-ejs-layouts")
// const cookieParser = require("cookie-parser")
// const methodOverride = require("method-override")
// const http = require('http')
// const path = require('path')
// const { Server } = require('socket.io')
// const server = http.createServer(app);
// const { addUser, getUsersInRoom, removeUser, getUser } = require('./utils/users');
// const { generateMessage } = require('./utils/messages');
// const io = new Server(server); // WebSocket 서버 생성

// 필요 기능 로그인 회원가입 게시판
// 홈 화면에 home.ejs가 들어가고 
// 홈 화면 상단에 앱 바로 게시판, 로그인 버튼
// 로그인 페이지에는 회원가입하기 버튼 존재함
// 회원가입하면 login으로 넘어간다.

// 게시판은 로그인 해야지 볼 수 있음.
// 게시판 눌렀는데 토큰이 없으면 로그인으로 넘어간다.

// 만드는 순서
// 1. config 아래에 dbConnect와 model에서 db 객체 넣기
// 2. view안에 있는 것들 선언 express-ejs-layouts 설치
// 2-1. 이외에도 ejs 설치하고 app.set으로 view engine 선택
// 3. public 폴더에 정적 요소를 넣고 실행
// 4. mainRoute 홈에 관련된 루트 정리. 홈 화면 가는 루트
// 5. authRoutes.js에서 로그인과 회원 가입을 처리함

// dbConnect()

// app.use(expressLayouts);
// app.use(express.static(path.join(__dirname, "public")));

// app.use(cookieParser())
// app.use(methodOverride("_method"));
// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// CORS 설정 추가
// CORS 설정
// app.use(cors({ origin: "http://localhost:5500", credentials: true }));
app.use(
  cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"], // 허용할 출처
    credentials: true, // 쿠키 허용
  })
);

// app.use("/", require("./routes/mainRoutes"))
app.use("/auth", require("./routes/authRoutes"))
// app.use("/", require("./routes/postRoutes"))
app.use("/chat", require("./routes/chatRoutes"))
// app.use("/", require("./routes/openchatRoutes"))

const port = 8008


app.listen(port, () => {
  console.log(`ARA-BE 서버가 ${port} 포트에서 실행 중`);
});