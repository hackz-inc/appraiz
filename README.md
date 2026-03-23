# Appraiz - ハッカソン採点システム

Next.js App Router + Supabaseで構築されたハッカソン採点システムです。legacy-scoring-systemをベースに、モダンなスタックで再構築しています。

## 技術スタック

- **Framework**: Next.js 16.2.1 (App Router with Turbopack)
- **Runtime**: React 19.2.4
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **State Management**: Zustand 5.0
- **Styling**: Tailwind CSS 4.2.2
- **Language**: TypeScript 5
- **Animation**: Framer Motion 12
- **Package Manager**: pnpm 10

## プロジェクト構造

```
appraiz/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # UIコンポーネント
│   │   ├── ui/          # 再利用可能な基本コンポーネント
│   │   └── features/    # 機能固有のコンポーネント
│   ├── lib/             # ユーティリティとライブラリ設定
│   │   └── supabase/    # Supabaseクライアント設定
│   ├── stores/          # Zustand状態管理
│   ├── styles/          # グローバルスタイルとテーマ
│   └── types/           # TypeScript型定義
├── supabase/
│   └── migrations/      # データベースマイグレーション
└── public/              # 静的ファイル
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example`を`.env.local`にコピーして、Supabaseの認証情報を設定してください。

```bash
cp .env.local.example .env.local
```

```.env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 3. Supabaseのセットアップ

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. `supabase/migrations/20240323000001_init_schema.sql`のマイグレーションを実行

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 主要機能

### 管理者機能
- ハッカソンの作成・編集・削除
- チーム管理
- 採点項目の設定
- 採点結果の閲覧

### ゲスト機能
- ハッカソン一覧の閲覧
- 採点結果の閲覧（権限がある場合）

### 審査員機能（公開）
- アクセスパスワードによる認証
- チームへの採点
- コメントの追加
- 採点結果のリアルタイム並び替え

## 開発状況

### 完了
- [x] プロジェクト基盤の構築
- [x] Supabaseデータベーススキーマ
- [x] Tailwind CSS 3での基本UIコンポーネント
  - Button, TextInput, TextArea, Container, Card, Modal, LoadingScreen
- [x] Zustand状態管理
  - ハッカソン、モーダル、スコアリングフォームストア
- [x] Supabase認証フロー
  - サインアップ、ログイン、ログアウト機能
  - Admin/Guest別認証
- [x] 認証ガード（AuthGuard, AdminAuthGuard, GuestAuthGuard）
- [x] 管理者ログインページ (`/admin/auth/login`)
- [x] 管理者ダッシュボード (`/admin`)
- [x] ゲストログイン・サインアップページ (`/guest/auth/login`, `/guest/auth/signup`)
- [x] ゲストダッシュボード (`/guest`)

### 今後の実装予定
- [ ] ハッカソン作成・編集機能
- [ ] チーム管理機能
- [ ] 採点項目設定機能
- [ ] 公開スコアリングフォーム（審査員用）
- [ ] 結果表示ページ
- [ ] アクセスパスワード認証

## 元のシステムからの主な変更点

1. **Pages Router → App Router**: Next.js 16 App Router + Turbopackを採用
2. **Recoil → Zustand**: より軽量でシンプルな状態管理
3. **Laravel → Supabase**: バックエンドをSupabaseに統合
4. **JWT Cookie → Supabase Auth**: 認証システムをSupabaseに移行
5. **Emotion → Tailwind CSS 4**: CSS-in-JSからユーティリティファーストCSSへ
6. **React 18 → React 19**: 最新のReact機能を活用

## ライセンス

Private
