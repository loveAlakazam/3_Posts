# 비밀글 기능이 포함된 게시판 웹서비스

#### 수행 기간: 2022.11.04 ~ 2022.11.07

## 사용기술스택

- Environment : Node.js
- Framework : NestJS
- Language : Typescript
- DB : MySQL
- ORM : TypeORM

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

<br><br>

### 게시글 등록

> 조건
>
> - 제목(최대 20자 제한)
> - 본문(최대 200지 제한)
> - 제목, 본문 모두 이모지 포함.

- URL: `[POST] localhost:3000/api/posts`

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

<br>

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

<br>

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

<br>

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

<br>

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

<br>

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

<br>

<br>

### 게시글 삭제

> URL : `/api/posts/:postId`

<br>
<br>

### 비밀글 설정

> 조건
>
> - 비밀번호 설정 (6자이상, 숫자 1개이상 반드시 포함)
> - 비밀번호 입력후 수정, 삭제 가능
> - 비밀번호는 데이터베이스에 암호화된 형태로 저장

<br>

### 비밀글 등록

> URL: `/api/posts/`
>
> #### Case : 비밀글 등록 (201)

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

<br>

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

<br>

> #### Case : 비밀번호 양식(숫자 최소 1개)에 어긋날 경우 (400)

- Request

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

### 게시글 목록

사용자가 앱이나 웹에서 스크롤을 내릴 때마다 오래된 글들이 계속 로드되는 형태

> - 게시글이 중복으로 나타나면 안됨.
> - 추가 로드는 20개 단위

> #### Case : 게시글 20개 이상

<br><br>

### 게시글 상세페이지

<br>

<br>

### ERD Diagram

유저(Users) : 게시글(Posts) 관계를 1:N 으로 했습니다.

<br><br>

<br><br>

## 고민과정
