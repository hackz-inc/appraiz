'use client'

import { Modal } from '@/components/ui'
import { useModalStore } from '@/stores'
import { CreateHackathonContent } from './contents/CreateHackathonContent'

export const ModalManager = () => {
  const { isOpen, type, config, closeModal } = useModalStore()

  const getModalContent = () => {
    switch (type) {
      case 'createHackathon':
        return <CreateHackathonContent />
      // 他のモーダルタイプもここに追加
      default:
        return config.content || null
    }
  }

  const getModalTitle = () => {
    switch (type) {
      case 'createHackathon':
        return 'ハッカソン作成'
      default:
        return config.title || ''
    }
  }

  const getModalSize = () => {
    switch (type) {
      case 'createHackathon':
        return 'lg'
      default:
        return config.size || 'md'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={getModalTitle()}
      size={getModalSize()}
    >
      {getModalContent()}
    </Modal>
  )
}
