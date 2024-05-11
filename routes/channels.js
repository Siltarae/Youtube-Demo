// express 모듈 세팅
const express = require("express");
const router = express.Router();
const conn = require("../mariadb");

router.use(express.json());

let db = new Map();
let id = 1;

function notFoundChannel(res) {
  res.status(404).json({
    message: "채널 정보가 없습니다.",
  });
}

router
  .route("/")
  // 채널 전체 조회
  .get((req, res) => {
    let { userId } = req.body;
    const sql = "SELECT * FROM `channels` Where user_id = ?";

    if (userId) {
      conn.query(sql, userId, (err, results) => {
        if (results.length) {
          res.status(200).json(results);
        } else {
          notFoundChannel(res);
        }
      });
    } else {
      res.status(400).end();
    }
  })
  //채널 개별 생성
  .post((req, res) => {
    let { name, userId } = req.body;
    const sql = "INSERT INTO `channels` (name, user_id) VALUES (?,?)";
    const values = [name, userId];

    if (name && userId) {
      conn.query(sql, values, (err, results) => {
        res.status(201).json(results);
      });
    } else {
      res.status(400).json({
        message: "입력 값을 다시 확인해주세요",
      });
    }
  });

router
  .route("/:id")
  // 채널 개별 조회
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    const sql = "SELECT * FROM `channels` Where id = ?";
    conn.query(sql, id, (err, results) => {
      if (results.length) {
        res.status(200).json(results);
      } else {
        notFoundChannel(res);
      }
    });
  })
  //채널 개별 수정
  .put((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    if (db.has(id) && req.body.channelTitle) {
      const oldTitle = db.get(id).channelTitle;
      const newTitle = req.body.channelTitle;
      db.set(id, req.body);
      res.status(200).json({
        message: `${oldTitle} 채널이 ${newTitle}로 수정되었습니다.`,
      });
    } else {
      notFoundChannel(res);
    }
  })
  //채널 개별 삭제
  .delete((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    if (db.has(id)) {
      let channel = db.get(id);
      db.delete(id);
      res.status(200).json({
        message: `${channel.channelTitle} 채널이 삭제되었습니다.`,
      });
    } else {
      notFoundChannel(res);
    }
  });

module.exports = router;
