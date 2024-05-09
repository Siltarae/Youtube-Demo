// express 모듈 세팅
const e = require("express");
const express = require("express");
const router = express.Router();

router.use(express.json());

let db = new Map();
let id = 1;

router
  .route("/")
  .get((req, res) => {
    let { userId } = req.body;
    let channels = [];

    if (db.size && userId) {
      for (let values of db.values()) {
        if (values.userId === userId) {
          channels.push(values);
        }
      }
      if (channels.length) {
        res.status(200).json(channels);
      } else {
        res.status(404).json({
          message: "채널 정보가 없습니다.",
        });
      }
    } else {
      res.status(404).json({
        message: "채널 정보가 없습니다.",
      });
    }
  }) // 채널 전체 조회
  .post((req, res) => {
    if (req.body.channelTitle) {
      let channel = req.body;
      db.set(id++, channel);
      res.status(201).json({
        message: `${req.body.channelTitle} 채널을 응원합니다!`,
      });
    } else {
      res.status(400).json({
        message: "요청값을 제대로 보내주세요",
      });
    }
  }); //채널 개별 생성

router
  .route("/:id")
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    if (db.has(id)) {
      res.status(200).json(db.get(id));
    } else {
      res.status(404).json({
        message: "채널 정보가 없습니다.",
      });
    }
  }) // 채널 개별 조회
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
      res.status(404).json({
        message: "채널 정보가 없습니다.",
      });
    }
  }) //채널 개별 수정
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
      res.status(404).json({
        message: "채널 정보가 없습니다.",
      });
    }
  });
//채널 개별 삭제

module.exports = router;
