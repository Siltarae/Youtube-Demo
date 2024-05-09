// express 모듈 세팅
const express = require("express");
const router = express.Router();

let db = new Map();

router.use(express.json());

// 로그인
router.post("/login", (req, res) => {
  const { userId, password } = req.body;
  let loginUser = {};
  const isExist = (obj) => Object.keys(obj).length !== 0;

  loginUser = getUserByUserId(userId);

  if (isExist(loginUser)) {
    console.log("같은거 찾았다.");
    if (loginUser.password === password) {
      console.log("패스워드가 같다");
    } else {
      console.log("패스워드가 다르다");
    }
  } else {
    console.log("입력하신 아이디는 없는 아이디 입니다.");
  }
});

// 회원가입
router.post("/join", (req, res) => {
  let { userId, password, name } = req.body;

  if (userId && password && name) {
    db.set(userId, req.body);
    res.status(201).json({
      message: `${name}님 환영합니다.`,
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
    let { userId } = req.body;
    const user = db.get(userId);

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
    let { id } = req.params;
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

function getUserByUserId(userId) {
  for (let user of db.values()) {
    if (user.userId === userId) {
      return user;
    }
  }
  return {}; // 일치하는 사용자가 없는 경우 빈 객체 반환
}

module.exports = router;
