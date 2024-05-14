// express 모듈 세팅
const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const { body, param, validationResult } = require("express-validator");

//jwt 모듈
const jwt = require("jsonwebtoken");

//dotenv모듈
const dotenv = require("dotenv");
dotenv.config();

router.use(express.json());

function validate(req, res, next) {
  const err = validationResult(req);
  if (err.isEmpty()) {
    return next();
  }
  return res.status(400).json(err.array());
}

// 로그인
router.post(
  "/login",
  [
    body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
    body("password").notEmpty().isString().withMessage("비밀번호 확인 필요"),
    validate,
  ],
  (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users Where email = ? and password = ?";
    const values = [email, password];

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(400).end();
      }

      let loginUser = results[0];
      if (loginUser) {
        const token = jwt.sign(
          {
            email: loginUser.email,
            name: loginUser.name,
          },
          process.env.PRIVATE_KEY,
          { expiresIn: "30m", issuer: "songa" }
        );

        res.cookie("token", token, { httpOnly: true });

        console.log(token);

        res.status(200).json({
          message: `${loginUser.name}님 로그인 되었습니다.`,
        });
      } else {
        res.status(403).json({
          message: "아이디 또는 비밀번호가 일치하지 않습니다.",
        });
      }
    });
  }
);

// 회원가입
router.post(
  "/join",
  [
    body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
    body("name").notEmpty().isString().withMessage("이름 확인 필요"),
    body("password").notEmpty().isString().withMessage("비밀번호 확인 필요"),
    body("contact").notEmpty().isString().withMessage("연락처 확인 필요"),
    validate,
  ],
  (req, res) => {
    let { email, name, password, contact } = req.body;
    const sql =
      "INSERT INTO users (email, name, password, contact) VALUES (?,?,?,?)";
    const values = [email, name, password, contact];

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(400).end();
      }

      res.status(201).json(results);
    });
  }
);

router
  .route("/users")
  //회원 개별 조회
  .get(
    [
      body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
      validate,
    ],
    (req, res) => {
      let { email } = req.body;
      const sql = "SELECT * FROM users Where email = ?";

      conn.query(sql, email, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        if (results.length) {
          res.status(200).json(results);
        } else {
          res.status(404).json({
            message: "회원 정보가 없습니다.",
          });
        }
      });
    }
  )
  //회원 탈퇴
  .delete(
    [
      body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
      validate,
    ],
    (req, res) => {
      let { email } = req.body;
      const sql = "DELETE FROM users Where email = ?";

      conn.query(sql, email, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        if (results.affectedRows === 0) {
          return res.status(400).end();
        }
        res.status(200).json(results);
      });
    }
  );

module.exports = router;
