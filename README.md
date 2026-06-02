# appraiz

ハッカソン採点管理システム。管理者がハッカソン・チーム・採点項目を設定し、審査員がURLとアクセスパスワードで採点フォームにアクセスして投票する。

## 技術スタック

- **フレームワーク**: TanStack Start (React SSR)
- **ランタイム**: Cloudflare Workers
- **DB**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
- **認証**: JWT (jose) + PBKDF2パスワードハッシュ
- **スタイル**: Tailwind CSS v4
- **Lint/Format**: Biome

## ロール

| ロール | 説明 |
|--------|------|
| Admin | ハッカソン・チーム・採点項目の管理、結果閲覧 |
| Guest | 招待された共同開催者（閲覧権限） |
| Scorer | URLとアクセスパスワードで採点するゲスト審査員（アカウント不要） |

## ローカル開発

### 1. 依存パッケージのインストール

```bash
pnpm install
```

### 2. 環境変数の設定

`.dev.vars` をプロジェクトルートに作成：

```
JWT_SECRET=任意の文字列
```

### 3. ローカルDBのマイグレーション

```bash
pnpm db:migrate:local
```

### 4. 開発サーバー起動

```bash
pnpm dev
```

http://localhost:3000 でアクセス可能。

### テスト用データの投入（ローカル）

```bash
pnpm db:seed:local
```

| 項目 | 値 |
|------|----|
| Admin Email | admin@example.com |
| Admin Password | password123 |

### DBの確認（Drizzle Studio）

```bash
pnpm db:studio
```

## 環境構成

| 環境 | DB | デプロイコマンド |
|------|-----|----------------|
| ローカル (dev) | miniflare自動生成SQLite | `pnpm dev` |
| Staging | Cloudflare D1（STG用） | `pnpm deploy:staging` |
| Production | Cloudflare D1（PRD用） | `pnpm deploy:production` |

## STG/PRD 初回セットアップ

```bash
# 1. Cloudflareにログイン
pnpm wrangler login

# 2. D1データベースをSTG/PRD別に作成
pnpm wrangler d1 create appraiz-staging
pnpm wrangler d1 create appraiz-production
# 出力された database_id を wrangler.toml の各envセクションに設定

# 3. DBにマイグレーションを適用
pnpm db:migrate:staging
pnpm db:migrate:production

# 4. JWT_SECRETをシークレットに登録
pnpm secret:put:staging JWT_SECRET
pnpm secret:put:production JWT_SECRET
```

## スクリプト一覧

| コマンド | 内容 |
|---------|------|
| `pnpm dev` | 開発サーバー起動（ローカルDB自動生成） |
| `pnpm build` | 本番ビルド |
| `pnpm deploy:staging` | ビルド + Stagingへデプロイ |
| `pnpm deploy:production` | ビルド + Productionへデプロイ |
| `pnpm db:generate` | スキーマ変更からマイグレーションファイルを生成 |
| `pnpm db:migrate:local` | ローカルD1にマイグレーションを適用 |
| `pnpm db:migrate:staging` | STG D1にマイグレーションを適用 |
| `pnpm db:migrate:production` | PRD D1にマイグレーションを適用 |
| `pnpm db:seed:local` | ローカルDBに初期データ投入 |
| `pnpm db:seed:staging` | STG DBに初期データ投入 |
| `pnpm db:seed:production` | PRD DBに初期データ投入 |
| `pnpm db:studio` | Drizzle Studio（ローカルDB GUI）を起動 |
| `pnpm lint` | Biome lintを実行 |
| `pnpm format` | Biome formatを実行 |
| `pnpm test` | Vitestでテストを実行 |

## ディレクトリ構成

```
src/
├── components/        # 共通UIコンポーネント
├── lib/
│   ├── auth/          # JWT認証・セッション管理
│   └── db/            # Drizzleスキーマ・クライアント・型定義
├── routes/
│   ├── admin/         # 管理者画面（ハッカソン管理・結果閲覧）
│   ├── guest/         # ゲスト画面
│   └── scorer/        # 採点フォーム（アカウント不要）
└── types/             # Cloudflare環境型定義
```

## 採点スコアの計算方法

審査員ごとのスコアを正規化して合算する方式（legacyシステム準拠）。

**正規化の目的**: 点数幅が大きい審査員が結果を支配しないようにする。

**計算式**:
```
各審査員ごとに：
  diff  = その審査員のmax点 - min点（チーム間）
  worth = floor(1000 / diff)
  チームのpoint = (スコア - min点) × worth

totalPoint = 全審査員のpointの合計でランキング
```

表示には生の合計スコア（`totalScore`）を使用し、ランキングは `totalPoint` で決定する。
