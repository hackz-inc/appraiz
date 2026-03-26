import styles from './index.module.css'

export const LoadingScreen = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
    </div>
  )
}
