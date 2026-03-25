# モーダルシステムの使い方

このプロジェクトでは、一つのモーダルインスタンスを使い回す設計を採用しています。

## 基本的な使い方

### 1. モーダルを開く

```tsx
import { useModalStore } from '@/stores'

function MyComponent() {
  const { openModal } = useModalStore()

  return (
    <button onClick={() => openModal('createHackathon')}>
      ハッカソンを作成
    </button>
  )
}
```

### 2. 新しいモーダルタイプを追加する

#### Step 1: モーダルタイプを定義

`src/stores/useModalStore.ts` にタイプを追加：

```typescript
export type ModalType =
  | 'createHackathon'
  | 'editHackathon'
  | 'createTeam'  // 新しいタイプ
  | null
```

#### Step 2: モーダルコンテンツコンポーネントを作成

`src/components/modals/contents/CreateTeamContent.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Button, TextInput } from '@/components/ui'
import { useModalStore } from '@/stores'

export const CreateTeamContent = () => {
  const { closeModal } = useModalStore()
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // API call here
    closeModal()
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="チーム名"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button type="submit">作成</Button>
    </form>
  )
}
```

#### Step 3: ModalManagerに追加

`src/components/modals/ModalManager.tsx` を更新：

```tsx
import { CreateTeamContent } from './contents/CreateTeamContent'

export const ModalManager = () => {
  const { isOpen, type, config, closeModal } = useModalStore()

  const getModalContent = () => {
    switch (type) {
      case 'createHackathon':
        return <CreateHackathonContent />
      case 'createTeam':
        return <CreateTeamContent />  // 追加
      default:
        return config.content || null
    }
  }

  const getModalTitle = () => {
    switch (type) {
      case 'createHackathon':
        return 'ハッカソン作成'
      case 'createTeam':
        return 'チーム作成'  // 追加
      default:
        return config.title || ''
    }
  }

  // ...
}
```

### 3. カスタムコンテンツでモーダルを開く

タイプを定義せずに、カスタムコンテンツを直接渡すこともできます：

```tsx
import { useModalStore } from '@/stores'

function MyComponent() {
  const { openModal } = useModalStore()

  const handleOpen = () => {
    openModal(null, {
      title: 'カスタムモーダル',
      size: 'lg',
      content: (
        <div>
          <p>カスタムコンテンツ</p>
        </div>
      )
    })
  }

  return <button onClick={handleOpen}>開く</button>
}
```

## 利点

1. **メモリ効率**: 一つのモーダルインスタンスのみが存在
2. **一貫性**: すべてのモーダルが同じスタイルと動作
3. **管理しやすい**: 一箇所でモーダルの状態を管理
4. **拡張性**: 新しいモーダルタイプを簡単に追加可能

## グローバル配置

`ModalProvider` は `app/layout.tsx` でグローバルに配置されているため、アプリケーションのどこからでもモーダルを開くことができます。
