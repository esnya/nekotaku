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
  - 立ち絵表示
- キャラクター管理
- マップ管理
  - グリッド
  - 背景画像
  - キャラクターコマ
  - 図形描画

## 使い方 / How to Use
### A. お試しサーバー / Trial Server
https://nekotaku.nekometer.info

### B. UIプレビュー（データ保存・共有なし） / UI Preview (Without data saving and sharering)
1. Requirements:
  - Node.js >= 6.11.3
  - yarn (install: `npm i -g yarn`)

2. Install dependencies.
  ```bash
  $ yarn
  ```
  
3. Configure.
  ```
  $ cp config/config.stub.json config/config.json
  ```

4. Start dev-server.
  ```bash
  $ yarn start
  ```

5. Open http://localhost:8080 with your browser.

### C. Firebase
1. Requirements:
  - Node.js >= 6.11.3
  - yarn
2. Setup your Firebase project.
3. Install dependencies.
  ```bash
  $ yarn
  ```
4. Configure.
  ```bash
  $ cp config/config.firebase.json config/config.json
  $ vi config/config.json
  # Write your Firbase API tokens and save.
  ```
5. Build. (or run locally to follow B-4, B-5)
  ```bash
  $ NODE_ENV=production yarn build
  ```

6. Deploy `<your-nekitaku-directory>/public` into your server.

### D. Standalone Server with MongoDB
1. Requirements:
  - Node.js >= 6.11.3
  - yarn
  - MongoDB
2. Install dependencies.
  ```bash
  $ yarn
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
  $ NODE_ENV=production yarn build
  ```
7. Run.
  ```
  $ node index.js
  ```
