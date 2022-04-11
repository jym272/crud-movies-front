import styles from './title.module.scss';

export const Title = () => {
    return <div className={styles.title}>
        <div>
            Go watch some movies!
        </div>
        <div className={styles.line}/>
    </div>
}