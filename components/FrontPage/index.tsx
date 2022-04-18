import Image from 'next/image';

import styles from "./FrontPage.module.scss"


export const FrontPage = () => {
    return (
        <div className={styles.container}>
            <Image
                src="/images/cinema.png"
                alt="Cinema Tickets"
                width={835}
                height={693}
                priority={true}
            />
        </div>
    );
};

