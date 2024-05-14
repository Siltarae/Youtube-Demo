// express 모듈 세팅
const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const { body, param, validationResult } = require("express-validator");

router.use(express.json());

function validate(req, res, next) {
  const err = validationResult(req);
  if (err.isEmpty()) {
    return next();
  }
  return res.status(400).json(err.array());
}

router
  .route("/")
  // 채널 전체 조회
  .get(
    [
      body("userId").notEmpty().isInt().withMessage("숫자를 입력 필요"),
      validate,
    ],
    (req, res) => {
      let { userId } = req.body;
      const sql = "SELECT * FROM channels Where user_id = ?";

      conn.query(sql, userId, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        if (results.length) {
          res.status(200).json(results);
        } else {
          res.status(400).end();
        }
      });
    }
  )
  //채널 개별 생성
  .post(
    [
      body("userId").notEmpty().isInt().withMessage("숫자를 입력 필요"),
      body("name").notEmpty().isString().withMessage("문자를 입력 필요"),
      validate,
    ],
    (req, res) => {
      let { name, userId } = req.body;

      const sql = "INSERT INTO channels (name, user_id) VALUES (?,?)";
      const values = [name, userId];
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
  .route("/:id")
  // 채널 개별 조회
  .get(
    [param("id").notEmpty().withMessage("채널id 필요"), validate],
    (req, res) => {
      let { id } = req.params;
      id = parseInt(id);

      const sql = "SELECT * FROM channels Where id = ?";
      conn.query(sql, id, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        if (results.length) {
          res.status(200).json(results);
        } else {
          res.status(400).end();
        }
      });
    }
  )
  //채널 개별 수정
  .put(
    [
      param("id").notEmpty().withMessage("채널id 필요"),
      body("name").notEmpty().isString().withMessage("채널명 오류"),
      validate,
    ],
    (req, res) => {
      let { id } = req.params;
      id = parseInt(id);

      let { name } = req.body;

      const sql = "UPDATE channels SET name = ? WHERE id = ?";
      const values = [name, id];
      conn.query(sql, values, (err, results) => {
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
  )

  //채널 개별 삭제
  .delete(
    [param("id").notEmpty().isInt().withMessage("채널id 필요"), validate],
    (req, res) => {
      let { id } = req.params;
      id = parseInt(id);
      const sql = "DELETE FROM channels Where id = ?";

      conn.query(sql, id, (err, results) => {
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
