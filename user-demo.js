// express 모듈 세팅
const express = require("express");
const app = express();
app.listen(7777);

let db = new Map();

let id = 1;

app.use(express.json());
// 로그인
app.post("/login", (req, res) => {});

// 회원가입
app.post("/join", (req, res) => {
  let {userId, pwd, name} = req.body;
  if (userId && pwd && name) {
    db.set(id++, req.body);
    res.status(201).json({
      message: `${name}님 환영합니다.`,
    });
  } else {
    res.status(400).json({
      message: "입력 값을 다시 확인해주세요",
    });
  }
});

app
  .route("/users/:id")
  .get((req, res) => {
    let {id} = req.params;
    id = parseInt(id);
    const user = db.get(id);
    if (user) {
      res.status(200).json({
        userId: user.userId,
        name: user.name,
      });
    } else {
      res.status(404).json({
        message: "회원 정보가 없습니다.",
      });
    }
  })
  .delete((req, res) => {
    let {id} = req.params;
    id = parseInt(id);
    const user = db.get(id);
    if (user) {
      db.delete(id);
      res.status(200).json({
        message: `${user.name}님 다음에 또 뵙겠습니다`,
      });
    } else {
      res.status(404).json({
        message: "회원 정보가 없습니다.",
      });
    }
  });
