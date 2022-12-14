# 비밀글 기능이 포함된 게시판 웹서비스

#### 수행 기간: 2022.11.04 ~ 2022.11.07

<br>

## 겪은 고민과 문제해결 과정 기록

- [테스케이스 어떻게 만들지? - Jest를 이용한 테스트 환경만들기](https://ek12mv2.tistory.com/325)
- [MySQL을 직접 불러오지 않고 테스트를 할수 없을까? - Joi: schema validation을 적용시켜보자](https://ek12mv2.tistory.com/342)
- [정규표현식에 알맞는 데이터를 확인하려면 어떻게 할까? - 입력데이터가 정규표현식에 알맞는 데이터인지 확인하기](https://ek12mv2.tistory.com/323)
- [raw데이터에서는 take()과 limit()이 적용되지 않아 pagination이 아닌 전체데이터가 리스폰스로 나와버렸다! 어떻게 해결해야되지? - pagination 구현과정과 리팩토링](https://ek12mv2.tistory.com/329)
- [(고도화) Axios를 활용하여 OpenAPI 로부터 현재 날씨 데이터를 파싱하기](https://ek12mv2.tistory.com/328)

<br>

## 사용기술스택

- Environment : Node.js
- Framework : NestJS
- Language : Typescript
- DB : MySQL
- ORM : TypeORM
- Unit-Test: Jest
- Etc: Github Action
  - 이슈브랜치 자동생성
  - Node.js 푸시후 특정브랜치에서의 자동빌드 (node 14, 16, 18 version)
  - Axios & OpenAPI

<br>

## 느낀점

> Jest를 활용한 유닛테스트 케이스작성을 위한 환경세팅과 테스트코드 작성이 낯설고 어려웠습니다.
>
> service.spec만 테스트하지 않으며, Repository단을 분리시켜 service.spec 테스트케이스 개선 및 controller.sepc 도 같이 테스트를 진행 할 예정입니다.

- [1차 service.spec.ts 테스트케이스](https://github.com/loveAlakazam/3_Posts/blob/d644e5c2fe2d08d81f8556c208893bb016bf6ad4/src/posts/test/posts.service.spec.ts)

<br>

### ERD Diagram

유저(Users) : 게시글(Posts) 관계를 1:N 으로 했습니다.

<img width="1263" alt="세번째과제erd" src="https://user-images.githubusercontent.com/108318308/202483894-23de4a71-7414-4b07-9fd3-3230bf3b5b16.png">

<br><br>

## 프로젝트 실행방법

> 런타임 실행

```bash

$ npm run start

```

<br>

> 패키지 설치

```bash

$ npm install

```

# 요구사항분석

## API 명세서

|        URL         | Method |    기능설명     |
| :----------------: | :----: | :-------------: |
|     /api/posts     |  POST  |   게시글 등록   |
|     /api/posts     |  GET   |   게시글 조회   |
| /api/posts/:postId |  GET   | 게시글 상세조회 |
| /api/posts/:postId | PATCH  |   게시글 수정   |
| /api/posts/:postId | DELETE |   게시글 삭제   |
| /api/posts/weather/today | GET | (테스트) 오늘 날씨상태 확인 |

<br><br>

### 게시글 등록

> 조건
>
> - 제목(최대 20자 제한)
> - 본문(최대 200지 제한)
> - 제목, 본문 모두 이모지 포함.

- URL: `[POST] localhost:3000/api/posts`


#### Ver2. 공개글 등록 (201)

- 응답데이터에 오늘 날씨 상태(weather) 추가

![image](https://user-images.githubusercontent.com/108318308/203454349-015251be-a0f5-4532-af49-f30ad76dff9c.png)



#### CASE : 공개글 등록 (201)

- Request

```json
{
  "title": "공개글",
  "content": "공개글 테스트 본문",
  "postType": "공개글"
}
```

- Response - StatusCode : **201**

```json
{
  "identifiers": [
    {
      "postId": 20,
      "userId": 2
    }
  ],
  "generatedMaps": [
    {
      "postId": 20,
      "postType": "공개글",
      "postPassword": null,
      "userId": 2,
      "dateColumns": {
        "createdAt": "2022-11-07T00:47:16.000Z",
        "updatedAt": "2022-11-07T00:47:16.080Z",
        "deleteAt": null
      }
    }
  ],
  "raw": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 20,
    "info": "",
    "serverStatus": 2,
    "warningStatus": 0
  }
}
```

<br><br>

#### Case : 타이틀 길이가 너무 길 때 (400)

- Request

```json
{
  "title": "공개글1dddddddddddddd1111111",
  "content": "공개글 테스트 본문 입니다다다다 🎃🤖 입니다",
  "postType": "공개글",
  "postPassword": "abcdefg111yy1"
}
```

- Response

```json
{
  "statusCode": 400,
  "message": ["title must be shorter than or equal to 20 characters"],
  "error": "Bad Request"
}
```

<br><br>

#### Case : postType이 '공개글', '비밀글'이 아닌 다른 값일 때 (400)

- Request

```json
{
  "title": "공개글",
  "content": "공개글 테스트 본문",
  "postType": "자유게시판"
}
```

- Response

```json
{
  "statusCode": 400,
  "message": ["postType must be a valid enum value"],
  "error": "Bad Request"
}
```

<br><br>

#### Case : title, content 에 빈값이 들어갈 때 (400)

- Request

```json
{
  "title": "",
  "content": "공개글 테스트 본문",
  "postType": "공개글"
}
```

- Response

```json
{
  "statusCode": 400,
  "message": [
    "title must be longer than or equal to 1 characters",
    "title should not be empty"
  ],
  "error": "Bad Request"
}
```

<br><br>

### 게시글 수정

> URL : `[PATCH] /api/posts/:postId`

#### Case : 수정성공(200)

> URL: `[PATCH] /api/posts/12`

- Request

```json
{
  "title": "오늘도 화이팅",
  "content": "화이팅~ 너무 무리하지 말아요~ 우리 모두 화이팅!"
}
```

- Response

```json
{
  "generatedMaps": [],
  "raw": [],
  "affected": 1
}
```

<br><br>

#### Case : title 을 20자 초과할때 (400)

- Request

```json
{
  "title": "월요일입니다 헬요일입니다 으아아아악ㅇㅇㅇㅇㅇㅇㅇㅇㅇ",
  "content": "월요일 입니다... 우리 모두 화이팅!!!!화이티이이이잉"
}
```

- Response

```json
{
  "statusCode": 400,
  "message": ["title must be shorter than or equal to 20 characters"],
  "error": "Bad Request"
}
```

<br>

#### Case : title 이 너무 짧을 때 (400)

- Request

```json
{
  "title": "",
  "content": "월요일 입니다... 우리 모두 화이팅!!!!화이티이이이잉"
}
```

- Response

```json
{
  "statusCode": 400,
  "message": ["title must be longer than or equal to 1 characters"],
  "error": "Bad Request"
}
```

<br><br>

#### Case : 작성자가 아닌 타인이 수정할 경우 (401)

- Request

```json
{
  "title": "월요일",
  "content": "화창한 월요일 아침입니다... 우리 모두 화이팅!"
}
```

- Response

```json
{
  "statusCode": 401,
  "message": "접근권한이 없습니다.",
  "error": "Unauthorized"
}
```

<br><br>

### 게시글 삭제

> Soft Delete 방식으로 삭제했습니다.

> URL : `/api/posts/:postId`

#### Case : 공개글 삭제 (200)

> URL : `localhost:3000/api/posts/17`

- Request

- Response

```json
{
  "generatedMaps": [],
  "raw": [],
  "affected": 1
}
```

<br><br>

### 비밀글 설정

> 조건
>
> - 비밀번호 설정 (6자이상, 숫자 1개이상 반드시 포함)
> - 비밀번호 입력후 수정, 삭제 가능
> - 비밀번호는 데이터베이스에 암호화된 형태로 저장

<br>

### 비밀글 등록

> URL: `/api/posts/`

#### Ver2. 비밀글 등록 (201)

- 오늘 날씨 상태 추가

![image](https://user-images.githubusercontent.com/108318308/203454658-0d0c27f9-a6c1-44d8-8789-18c30dbd5754.png)

<br>

#### Ver2. 비밀글 조회 (200)

![image](https://user-images.githubusercontent.com/108318308/203454835-3312fcaa-1703-4b13-97bd-fc7b47886358.png)

<br>

#### Case : 비밀글 등록 (201)

- Request

```json
{
  "title": "비밀글",
  "content": "비밀글 테스트 본문 입니다다다다 🎃🤖 입니다",
  "postType": "비밀글",
  "postPassword": "(비밀번호)"
}
```

- Response

```json
{
  "identifiers": [
    {
      "postId": 23,
      "userId": 2
    }
  ],
  "generatedMaps": [
    {
      "postId": 23,
      "postType": "비밀글",
      "postPassword": "(암호화된값)",
      "userId": 2,
      "dateColumns": {
        "createdAt": "2022-11-07T00:47:37.000Z",
        "updatedAt": "2022-11-07T00:47:37.965Z",
        "deleteAt": null
      }
    }
  ],
  "raw": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 23,
    "info": "",
    "serverStatus": 2,
    "warningStatus": 0
  }
}
```

<br><br>

> #### Case : 비밀번호가 짧을 때 (400)

- Request

```json
{
  "title": "비밀글1",
  "content": "비밀글 테스트 본문 입니다다다다 🎃🤖 입니다",
  "postType": "비밀글",
  "postPassword": "ayy1"
}
```

- Response

```json
{
  "statusCode": 400,
  "success": false,
  "timestamp": "2022-11-06T15:02:39.355Z",
  "path": "/api/posts/",
  "message": "비밀번호는 6자이상이며 최소 한개의 숫자가 있어야합니다."
}
```

<br><br>

> #### Case : 비밀번호 양식(숫자 최소 1개)에 어긋날 경우 (400)

- Request(Body)

```json
{
  "title": "비밀글 타이틀",
  "content": "비밀글 테스트 본문 입니다다다다 🎃🤖 입니다",
  "postType": "비밀글",
  "postPassword": "abcdefghij"
}
```

- Response

```json
{
  "statusCode": 400,
  "message": "비밀번호는 6자리 이상이며, 숫자는 최소 1개가 필요합니다.",
  "error": "Bad Request"
}
```

<br><br>

#### Case: 비밀글 수정 (200)

> URL : `[PATCH] /api/posts/:postId`

- Request(Body)

```json
{
  "title": "비밀글 수정",
  "content": "비밀글 수정했습니다",
  "postPassword": "bank11brothers"
}
```

- Response

```json
{
  "generatedMaps": [],
  "raw": [],
  "affected": 1
}
```

<br><br>

#### Case: 비밀글 수정 실패 - 비밀번호가 일치하지 않을 때 (400)

- Request(Body)

```json
{
  "title": "3비밀글 수3정",
  "content": "비밀글 수정했습니다",
  "postPassword": "bank2brothers"
}
```

- Response

```json
{
  "statusCode": 400,
  "message": "비밀번호가 일치하지 않습니다.",
  "error": "Bad Request"
}
```

<br><br>

#### Case: 비밀글 수정 실패 - 너무 짧은 title/content 값 (400)

- Request(Body)

```json
{
  "title": "",
  "content": "비밀글 수정했습니다",
  "postPassword": "bank11brothers"
}
```

- Response

```json
{
  "statusCode": 400,
  "message": ["title must be longer than or equal to 1 characters"],
  "error": "Bad Request"
}
```

<br><br>

#### Case: 비밀글 수정 실패 - 타계정으로 수정할 때 (401)

- Request(Body)

```json
{
  "title": "비밀글 수정",
  "content": "비밀글 수정했습니다2222",
  "postPassword": "bank11brothers"
}
```

- Response

```json
{
  "statusCode": 401,
  "message": "접근권한이 없습니다.",
  "error": "Unauthorized"
}
```

<br><br>

#### Case: 비밀글 삭제 (200)

> URL : `[DELETE] /api/posts/:postId`

- Request(Body)

```json
{
  "postPassword": "bank11brothers"
}
```

- Response

```json
{
  "generatedMaps": [],
  "raw": [],
  "affected": 1
}
```

<br><br>

#### Case: 비밀글 삭제 (401)

> 작성자가 아닌 계정으로 삭제할 때

- Response

```json
{
  "statusCode": 401,
  "message": "접근권한이 없습니다.",
  "error": "Unauthorized"
}
```

<br>

> 비밀번호가 일치하지 않을 때

- Request(Body)

```json
{
  "postPassword": "bank11"
}
```

- Response

```json
{
  "statusCode": 400,
  "message": "비밀번호가 일치하지 않습니다.",
  "error": "Bad Request"
}
```

<br><br>

### 게시글 목록

사용자가 앱이나 웹에서 스크롤을 내릴 때마다 오래된 글들이 계속 로드되는 형태

> - 게시글이 중복으로 나타나면 안됨.
> - 추가 로드는 20개 단위

> - URL : `[GET] /api/posts/`

> #### Case : 게시글 한 페이지당 20개씩, 1페이지 (200)

> 요청 URL : `http://localhost:3000/api/posts/`

- Response

```json
{
  "list": [
    {
      "postId": 22,
      "title": "비밀글",
      "userId": 2,
      "name": "Sheryl Schamberger"
    },
    {
      "postId": 23,
      "title": "비밀글",
      "userId": 2,
      "name": "Sheryl Schamberger"
    },
    {
      "postId": 21,
      "title": "비밀글",
      "userId": 2,
      "name": "Sheryl Schamberger"
    },
    {
      "postId": 20,
      "title": "공개글",
      "userId": 2,
      "name": "Sheryl Schamberger"
    },
    {
      "postId": 18,
      "title": "공개글",
      "userId": 2,
      "name": "Sheryl Schamberger"
    },
    {
      "postId": 19,
      "title": "공개글",
      "userId": 2,
      "name": "Sheryl Schamberger"
    },
    {
      "postId": 16,
      "title": "공개글",
      "userId": 2,
      "name": "Sheryl Schamberger"
    },
    {
      "postId": 17,
      "title": "공개글",
      "userId": 2,
      "name": "Sheryl Schamberger"
    },
    {
      "postId": 15,
      "title": "공개글",
      "userId": 2,
      "name": "Sheryl Schamberger"
    },
    {
      "postId": 13,
      "title": "공개글",
      "userId": 2,
      "name": "Sheryl Schamberger"
    },
    {
      "postId": 14,
      "title": "공개글",
      "userId": 2,
      "name": "Sheryl Schamberger"
    },
    {
      "postId": 11,
      "title": "공개글",
      "userId": 1,
      "name": "Carl Rath"
    },
    {
      "postId": 12,
      "title": "오늘도 화이팅",
      "userId": 1,
      "name": "Carl Rath"
    },
    {
      "postId": 9,
      "title": "공개글",
      "userId": 1,
      "name": "Carl Rath"
    },
    {
      "postId": 10,
      "title": "공개글",
      "userId": 1,
      "name": "Carl Rath"
    },
    {
      "postId": 8,
      "title": "공개글",
      "userId": 1,
      "name": "Carl Rath"
    },
    {
      "postId": 7,
      "title": "공개글",
      "userId": 1,
      "name": "Carl Rath"
    },
    {
      "postId": 6,
      "title": "공개글",
      "userId": 1,
      "name": "Carl Rath"
    },
    {
      "postId": 4,
      "title": "월요일",
      "userId": 1,
      "name": "Carl Rath"
    },
    {
      "postId": 3,
      "title": "비2밀글22",
      "userId": 2,
      "name": "Sheryl Schamberger"
    }
  ],
  "page": 1,
  "pageSize": 20
}
```

<br><br>

> #### Case : 게시글 한 페이지당 10개씩, 2페이지 (200)

- Request : `http://localhost:3000/api/posts/?page=2&pageSize=10`

- Response

```json
{
  "list": [
    {
      "postId": 14,
      "title": "공개글",
      "userId": 2,
      "name": "Sheryl Schamberger"
    },
    {
      "postId": 11,
      "title": "공개글",
      "userId": 1,
      "name": "Carl Rath"
    },
    {
      "postId": 12,
      "title": "오늘도 화이팅",
      "userId": 1,
      "name": "Carl Rath"
    },
    {
      "postId": 9,
      "title": "공개글",
      "userId": 1,
      "name": "Carl Rath"
    },
    {
      "postId": 10,
      "title": "공개글",
      "userId": 1,
      "name": "Carl Rath"
    },
    {
      "postId": 8,
      "title": "공개글",
      "userId": 1,
      "name": "Carl Rath"
    },
    {
      "postId": 7,
      "title": "공개글",
      "userId": 1,
      "name": "Carl Rath"
    },
    {
      "postId": 6,
      "title": "공개글",
      "userId": 1,
      "name": "Carl Rath"
    },
    {
      "postId": 4,
      "title": "월요일",
      "userId": 1,
      "name": "Carl Rath"
    },
    {
      "postId": 3,
      "title": "비2밀글22",
      "userId": 2,
      "name": "Sheryl Schamberger"
    }
  ],
  "page": 2,
  "pageSize": 10
}
```

<br><br>

### 게시글 상세페이지 - 공개글(200)

#### Ver2. 공개글 + 날씨상태 데이터 추가

- 이전에 작성한 데이터들은 날씨상테(weather) 컬럼 값이 null 입니다.

![image](https://user-images.githubusercontent.com/108318308/203454613-d13bb83c-7f87-435b-b772-779b4756580a.png)

<br>

- Request : `http://localhost:3000/api/posts/1`

- Response

```json
{
  "postId": 1,
  "postType": "공개글",
  "title": "공개글2",
  "content": "공개글 테스트 본문2",
  "userId": 1,
  "name": "Carl Rath"
}
```

<br><br>

### 게시글 상세페이지 - 비밀글(200)

- Request : `http://localhost:3000/api/posts/2`

```json
{
  "postPassword": "bank11brothers"
}
```

- Response

```json
{
  "postId": 2,
  "postType": "비밀글",
  "title": "비밀글 수정",
  "content": "비밀글 수정했습니다",
  "userId": 1,
  "name": "Carl Rath"
}
```

<br><br>

### 게시글 상세페이지 - 비밀글의 비밀번호가 틀릴 때(400)

> URL : `localhost:3000/api/posts/2`

- Request

```json
{
  "postPassword": "bank2brothers"
}
```

- Response

```json
{
  "statusCode": 400,
  "message": "비밀번호가 일치하지 않습니다.",
  "error": "Bad Request"
}
```
