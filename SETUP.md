# 🚀 Appraiz セットアップガイド

このガイドでは、Supabase CLIを使ったプロジェクトのセットアップ方法を説明します。

## 📋 前提条件

- Node.js 18以上
- pnpm
- Supabase CLI（インストール済み）
- Supabaseアカウント

## 🎯 クイックスタート（3ステップ）

### 1️⃣ プロジェクトにリンク

```bash
pnpm supabase:link
```

ブラウザでSupabaseログインが求められるので、ログインしてください。

### 2️⃣ マイグレーション適用

```bash
pnpm supabase:migrate
```

リモートデータベースにテーブルが作成されます。

### 3️⃣ シーダーデータ投入

```bash
pnpm supabase:seed
```

テストユーザーとサンプルデータが作成されます。

### 4️⃣ 開発サーバー起動

```bash
pnpm dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## 🔑 テストアカウント

シーダー実行後、以下のアカウントでログインできます：

### 管理者
- **URL:** http://localhost:3000/admin/auth/login
- **Email:** `admin@example.com`
- **Password:** `password123`

### ゲスト
- **URL:** http://localhost:3000/guest/auth/login
- **Email:** `guest1@example.com` （または `guest2`、`guest3`）
- **Password:** `password123`

## 📂 プロジェクト構成

```
appraiz/
├── supabase/
│   ├── config.toml                        # Supabase CLI設定
│   ├── migrations/                        # DBマイグレーション
│   │   └── 20240101000000_initial_schema.sql
│   ├── seed.sql                          # シーダーデータ
│   ├── sql/                              # 手動実行用（オプション）
│   └── README.md                         # Supabase詳細ガイド
├── src/
│   ├── routes/                           # TanStack Routerページ
│   │   ├── admin/                        # 管理者ページ
│   │   └── guest/                        # ゲストページ
│   ├── lib/
│   │   ├── auth/                         # 認証ロジック
│   │   │   ├── auth.ts
│   │   │   ├── middleware.ts            # ルート保護
│   │   │   └── types.ts
│   │   └── supabase/
│   │       └── client.ts                 # Supabaseクライアント
│   └── components/
│       └── ui/                           # UIコンポーネント
└── .env.local                            # 環境変数
```

## 🛠️ 開発コマンド

### アプリケーション

```bash
pnpm dev          # 開発サーバー起動
pnpm build        # ビルド
pnpm preview      # プレビュー
pnpm lint         # Linter実行
pnpm format       # フォーマット
```

### Supabase

```bash
pnpm supabase:link       # プロジェクトにリンク
pnpm supabase:migrate    # マイグレーション適用
pnpm supabase:seed       # シーダー実行
pnpm supabase:status     # ステータス確認
```

詳細は `supabase/README.md` を参照してください。

## 🔄 開発ワークフロー

### 初回セットアップ

```bash
# 1. 依存関係インストール
pnpm install

# 2. Supabaseセットアップ
pnpm supabase:link
pnpm supabase:migrate
pnpm supabase:seed

# 3. 開発サーバー起動
pnpm dev
```

### スキーマ変更

```bash
# 1. 新しいマイグレーション作成
supabase migration new add_new_feature

# 2. 作成されたファイルを編集
# supabase/migrations/<timestamp>_add_new_feature.sql

# 3. マイグレーション適用
pnpm supabase:migrate
```

## 🔐 環境変数

`.env.local`ファイルに以下を設定：

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

キーはSupabaseダッシュボードの Settings > API から取得できます。

## 🎨 認証フロー

このプロジェクトはTanStack Routerの`beforeLoad`を使った認証ミドルウェアを実装しています：

### 保護されたルート
- `/admin` - 管理者のみアクセス可能
- `/guest` - ゲストのみアクセス可能

### 認証済みユーザーのリダイレクト
- `/admin/auth/login` - ログイン済みの場合 → `/admin`へ
- `/guest/auth/login` - ログイン済みの場合 → `/guest`へ
- `/guest/auth/signup` - ログイン済みの場合 → `/guest`へ

詳細は `src/lib/auth/middleware.ts` を参照。

## 📚 参考資料

- [Supabase CLI ドキュメント](https://supabase.com/docs/guides/cli)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Start](https://tanstack.com/start)
- [Tailwind CSS](https://tailwindcss.com)

## ⚠️ トラブルシューティング

### "missing email or phone" エラー

環境変数が正しく設定されていない可能性があります：

1. `.env.local`の内容を確認
2. 開発サーバーを再起動
3. ブラウザのコンソールでエラーを確認

### マイグレーションエラー

```bash
# リモートDBの状態を確認
supabase db remote ls

# ローカルとリモートを同期
supabase db pull
```

### ログインできない

1. シーダーが実行されているか確認：
   ```bash
   pnpm supabase:seed
   ```

2. Supabase Dashboardで`auth.users`テーブルを確認

## 🤝 サポート

問題が発生した場合：

1. `supabase/README.md`を確認
2. エラーログを確認（ブラウザコンソール、ターミナル）
3. Supabase Dashboardでデータを確認

---

Happy Coding! 🎉
