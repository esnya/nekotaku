# ねこ卓 (NekoTaku)

[![Build Status](https://img.shields.io/travis/ukatama/nekotaku/master.svg?style=flat-square)](https://travis-ci.org/ukatama/nekotaku)
[![Coverage Status](https://img.shields.io/coveralls/ukatama/nekotaku.svg?style=flat-square)](https://coveralls.io/github/ukatama/nekotaku)
[![Dependencies](https://img.shields.io/david/ukatama/nekotaku.svg?style=flat-square)](https://david-dm.org/ukatama/nekotaku)
[![DevDependencies](https://img.shields.io/david/dev/ukatama/nekotaku.svg?style=flat-square)](https://david-dm.org/ukatama/nekotaku?type=dev)

モバイルフレンドリーなオンラインセッション支援ツール

## できること / Features
- チャット
  - ダイスロール
    - どどんとふ互換
    - アニメーション表示（一部のみ対応）
  - チャットパレット
  - 立ち絵表示
- キャラクター管理
- マップ管理
  - グリッド
  - 背景画像
  - キャラクターコマ
  - 図形描画

## スクリーンショット / Screen Shots
![ss01.png](https://raw.githubusercontent.com/ukatama/nekotaku/master/docs/img/ss01.png)
![ss02.png](https://raw.githubusercontent.com/ukatama/nekotaku/master/docs/img/ss02.png)
![ss03.png](https://raw.githubusercontent.com/ukatama/nekotaku/master/docs/img/ss03.png)
![ss04.png](https://raw.githubusercontent.com/ukatama/nekotaku/master/docs/img/ss04.png)

## 素材 / Thanks
サンプルキャラクター画像は[どぉるキャラメイカー](http://hitsuji15.net/doll.html)様で作成しました。

## 更新履歴 / Changelog
[CHANGELOG.md](https://github.com/ukatama/nekotaku/blob/master/CHANGELOG.md)

All notable changes to this project will be documented in `CHANGELOG.md`.
This project adheres to [Semantic Versioning](http://semver.org/).

## 使い方 / How to Use
### A. お試しサーバー / Trial Server
https://nekotaku.nekometer.info

### B. UIプレビュー（データ保存・共有なし） / UI Preview (Without data saving and sharering)
1. Requirements:
  - Node.js >= 6.11.3

2. Install dependencies.
  ```bash
  $ npm install
  ```

3. Configure.
  ```
  $ cp config/config.stub.json config/config.json
  ```

4. Start dev-server.
  ```bash
  $ npm start
  ```

5. Open http://localhost:8080 with your browser.

### C. Firebase
1. Requirements:
  - Node.js >= 6.11.3
2. Setup your Firebase project.
3. Install dependencies.
  ```bash
  $ npm install
  ```
4. Configure.
  ```bash
  $ cp config/config.firebase.json config/config.json
  $ vi config/config.json
  # Write your Firbase API tokens and save.
  ```
5. Build. (or run locally to follow B-4, B-5)
  ```bash
  $ NODE_ENV=production npm run build
  ```

6. Deploy `<your-nekotaku-directory>/dist` into your server.

### D. Standalone Server with MongoDB
1. Requirements:
  - Node.js >= 6.11.3
  - MongoDB
2. Install dependencies.
  ```bash
  $ npm install
  ```
4. Configure client.
  ```bash
  $ cp config/config.server.json config/config.json
  ```
5. Configure server.
  ```bash
  $ cp config/server.mongodb.json config/server.json
  $ vi config/server.json
  # Edit config
  ```
6. Build.
  ```
  $ NODE_ENV=production npm run build
  ```
7. Run.
  ```
  $ node index.js
  ```

### E. Docker
```
$ docker run -d --name nekotaku-db mongo
$ docker run -d --name nekotaku -p 8080:8080 --link nekotaku-db:db nekometer/nekotaku
```

### F. Docker Compose
1. Build Docker Image.
  ```
  $ docker-compose build
  ```
2. Run.
  ```
  $ docker-compose up
  ```

## 設定 / Configuration
### `config/config.json`
```js
{
  "backend": { // Required
    "type": "stub", // "stub" or "firebase" or "socket"

    // Firebase Configuration
    "apiKey": "Your API Key",
    "authDomain": "Your Auth Domain",
    "databaseURL": "Your Database URL",
    "projectId": "Your Project Id",
    "storageBucket": "Your Storage Bucket",
    "messagingSenderId": "Your Messaging Sender Id"
  },
  "welcomeMessage": { // Optional
    "id": "201709130610", // Update to new id to visible message again
    "title": "「ねこ卓」へようこそ",
    "body": [
      "ご意見・ご要望・バグ報告歓迎です。詳細はメニューの「フィードバック」を御覧ください"
    ],
    "forceVisible": false
  },
  "feedbackFormURL": "http://url.to.your.form",
  "theme": { // Optional
    "primary": "blue.darken2", // or hex color code "#FF0000"
    "secondary": "grey.darken3",
    "accent": "blue.accent1",
    "error": "red.accent2",
    "info": "blue.base",
    "success": "green.base",
    "warning": "amber.base"
  },
  "googleAnalytics": { // Optional
    "id": "GOOGLE_ANALYTICS_ID"
  },
  "title": "ねこ卓" // Optional
}
```

### `config/server.json`
```js
{
  "datastore": { // Required
    "type": "mongodb",

    "url": "mongodb://localhost:27017/nekotaku"
  },
  "http": { // Required
    "host": "0.0.0.0",
    "port": 8080
  },
  "file": { // Required
    "path": "./data/files",
    "maxSize": "10MB"
  },
  "loglevel": "INFO" // Required
}
```
