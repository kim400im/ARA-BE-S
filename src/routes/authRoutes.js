const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase")
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// // Mock 데이터베이스
// const users = [
//   { username: "ki", password: "1111" }, // 예제 사용자
// ];



// 로그인 처리 라우트
router.post("/login", async (req, res) => {
  const { userid, password } = req.body;

  console.log("usernmae is ", userid);

  // 사용자 입력 확인
  if (!userid || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }


  try {
    // Supabase에서 사용자 검색
    const { data: user, error } = await supabase
      .from("users")
      .select("id, userid, password_hash")
      .eq("userid", userid)
      .single(); // 단일 사용자 검색

    if (error || !user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    console.log("User object", user);
    
    // 3. JWT 토큰 생성
    const token = jwt.sign({ userId: user.id, userid: user.userid }, jwtSecret, {
        expiresIn: '1h', // 토큰 만료 시간 설정 (1시간)
    });
    console.log("generated token", token);

    // 4. 토큰을 쿠키에 저장 (optional)
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); // 1시간

    console.log("Success login");
    return res.status(200).json({ message: "Login successful", token, userid });
  } catch (err) {
    console.error("Error logging in:", err);
    return res.status(500).json({ message: "An error occurred during login." });
  }
});

// 회원가입 처리 API
router.post("/register", async (req, res) => {
  const { username, userid, password } = req.body;

  if (!username || !userid || !password) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  try {
    // 비밀번호 해시 처리
    const hashedPassword = await bcrypt.hash(password, 10);

    // Supabase에 데이터 저장
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          username: username,
          userid: userid,
          password_hash: hashedPassword,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting user:", error);
      return res.status(500).json({ message: "회원가입 중 오류가 발생했습니다." });
    }

    return res.status(201).json({ message: "회원가입이 완료되었습니다!", user: data[0] });
  } catch (err) {
    console.error("Error in register:", err);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});


// 로그인 상태 확인 및 사용자 정보 제공 API
router.get("/user-info", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Authorization Header:", authHeader); // 디버깅 추가
  console.log("usef info token is ", token);

  if (!token) {
    console.log("Token not provided"); // 디버깅 추가
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.userId; // JWT에서 userId 추출
    const userid = decoded.userid; // JWT에서 userid 추출
    // console.log('username is ', username)
    // Supabase에서 users 테이블 조회하여 username 가져오기
    const { data: user, error } = await supabase
      .from("users")
      .select("username")
      .eq("id", userId)
      .single();

      if (error || !user) {
        console.error("Error fetching user from Supabase:", error);
        return res.status(404).json({ message: "User not found" });
      }

      console.log("Fetched user:", user);

    return res.status(200).json({ username: user.username, userid: userid });
  } catch (err) {
    console.error("JWT verification failed:", err); // 디버깅 추가
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});

// 로그아웃 처리 (프론트엔드에서 토큰 삭제로 처리 가능)
router.post("/logout", (req, res) => {
  res.clearCookie("token", {httpOnly:true,});
  console.log("logout success")
  // res.cookie("token", "", { httpOnly: true, maxAge: 0 }); // 쿠키 만료
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;