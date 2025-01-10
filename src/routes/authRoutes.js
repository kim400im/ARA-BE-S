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


module.exports = router;