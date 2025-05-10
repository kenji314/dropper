# 東京子育てサポートファインダー / Tokyo Childcare Support Finder

外国人居住者のための東京都子育て支援制度検索サービス。  
A search service for childcare support programs in Tokyo for foreign residents.

## 概要 / Overview

このアプリケーションは、東京都内の各自治体（区市町村）が提供している子育て支援制度を外国人居住者が簡単に検索できるウェブサービスです。20カ国語に対応しており、制度の詳細や申請方法、必要書類などを確認できます。

This application is a web service that allows foreign residents to easily search for childcare support programs provided by municipalities (cities, wards, towns, and villages) in Tokyo. It supports 20 languages and provides details on programs, application methods, required documents, and more.

## 特徴 / Features

- **多言語対応 / Multilingual Support**  
  20カ国語（日本語、英語、中国語、韓国語など）に対応
  Supports 20 languages (Japanese, English, Chinese, Korean, etc.)

- **様々な検索機能 / Various Search Functions**  
  カテゴリ、自治体、受給資格などでフィルタリング可能
  Filter by category, municipality, eligibility, etc.

- **詳細情報の表示 / Detailed Information Display**  
  各制度の詳細な情報（受給資格、申請方法、必要書類など）
  Detailed information on each program (eligibility, application process, required documents, etc.)

- **受給資格チェック機能 / Eligibility Check Tool**  
  在留資格や住民登録状況などから利用可能な制度を確認
  Check available programs based on residency status, registration status, etc.

## 対応言語 / Supported Languages

日本語(ja)、英語(en)、中国語(zh)、韓国語(ko)、ベトナム語(vi)、タガログ語(tl)、ネパール語(ne)、タイ語(th)、ポルトガル語(pt)、スペイン語(es)、インドネシア語(id)、フランス語(fr)、ドイツ語(de)、ロシア語(ru)、ミャンマー語(my)、モンゴル語(mn)、ヒンディー語(hi)、アラビア語(ar)、ベンガル語(bn)、ウルドゥー語(ur)

## 開発環境 / Development Environment

- React.js
- Tailwind CSS
- Lucide React (アイコン)

## インストール方法 / Installation

```bash
# リポジトリのクローン / Clone the repository
git clone https://github.com/yourusername/tokyo-childcare-support-finder.git
cd tokyo-childcare-support-finder

# 依存関係のインストール / Install dependencies
npm install

# 開発サーバーの起動 / Start development server
npm start
```

## デプロイ方法 / Deployment

Vercelを使った簡単なデプロイ:

```bash
# Vercel CLIのインストール / Install Vercel CLI
npm install -g vercel

# デプロイ / Deploy
vercel
```

## 貢献 / Contribution

翻訳の改善や新機能の提案など、プロジェクトへの貢献を歓迎します。  
Contributions to the project, such as translation improvements or new feature suggestions, are welcome.

1. このリポジトリをフォーク / Fork this repository
2. 新しいブランチを作成 / Create a new branch
3. 変更を加えてコミット / Make and commit changes
4. プルリクエストを送信 / Submit a pull request

## データソース / Data Source

東京都および各自治体の公開データを基に作成されています。  
Based on public data from the Tokyo Metropolitan Government and municipalities.

## ライセンス / License

[MIT License](LICENSE)