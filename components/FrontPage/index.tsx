import Image from 'next/image';

import styles from "./FrontPage.module.scss"
import {useContext} from "react";
import {store} from "../Store";


export const FrontPage = () => {
    const context = useContext(store)
    return (
        <div className={ context.darkMode ? styles.container__darkMode:styles.container }>
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

