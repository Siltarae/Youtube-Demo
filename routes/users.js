// express 모듈 세팅
const express = require("express");
const router = express.Router();
const conn = require("../mariadb");

router.use(express.json());

// 로그인
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM `users` Where email = ? and password = ?";
  const values = [email, password];

  conn.query(sql, values, (_, results) => {
    let loginUser = results[0];
    if (loginUser) {
      res.status(200).json({
        message: `${loginUser.name}님 로그인 되었습니다.`,
      });
    } else {
      res.status(404).json({
        message: "아이디 또는 비밀번호가 일치하지 않습니다.",
      });
    }
  });
});

// 회원가입
router.post("/join", (req, res) => {
  let { email, name, password, contact } = req.body;
  const sql =
    "INSERT INTO `users` (email, name, password, contact) VALUES (?,?,?,?)";
  const values = [email, name, password, contact];

  if (email && name && password) {
    conn.query(sql, values, () => {
      res.status(201).json({
        message: "회원가입이 완료되었습니다.",
      });
    });
  } else {
    res.status(400).json({
      message: "입력 값을 다시 확인해주세요",
    });
  }
});

router
  .route("/users")
  .get((req, res) => {
    let { email } = req.body;
    const sql = "SELECT * FROM `users` Where email = ?";

    conn.query(sql, email, (err, results) => {
      if (results.length) {
        res.status(200).json(results);
      } else {
        res.status(404).json({
          message: "회원 정보가 없습니다.",
        });
      }
    });
  })
  .delete((req, res) => {
    let { email } = req.body;
    const sql = "DELETE FROM `users` Where email = ?";

    conn.query(sql, email, (err, results) => {
      res.status(200).json(results);
    });
  });

module.exports = router;
