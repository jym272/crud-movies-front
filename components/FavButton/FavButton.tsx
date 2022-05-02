//import react
import React, {useEffect} from "react";
import styles from './FavButton.module.scss'

export const FavButton = ({isFavorite,checkboxID, accessToken}:{isFavorite: boolean, checkboxID:number, accessToken:string}) => {

    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isFavoriteState, setIsFavoriteState] = React.useState(isFavorite);

    useEffect(()=>{
        //checked the input
        if(inputRef.current){
            inputRef.current.checked = isFavoriteState;
        }

    },[isFavoriteState])


    const clickHandler =(event:React.MouseEvent<HTMLDivElement>)=>{
        event.stopPropagation();
        const target = event.target as EventTarget & HTMLInputElement;
        const init = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        }
        if(target.id && target.id.length > 0 && Number(target.id) === checkboxID){
            if (isFavorite){
                fetch(`${process.env.APP_API}/v1/user/favorites?movie=${checkboxID}&action=remove`, init)
                    .then(res => res.json())
                    .then(data => {
                        if (data == "removed") {
                            setIsFavoriteState(false)
                        } else {
                            setIsFavoriteState(true)
                        }
                    }).catch(err => console.log(err))

            }else{
                fetch(`${process.env.APP_API}/v1/user/favorites?movie=${checkboxID}&action=add`, init)
                    .then(res => res.json())
                    .then(data => {
                        if (data == "added") {
                            setIsFavoriteState(true)
                        } else {
                            setIsFavoriteState(false)
                        }
                    }).catch(err => console.log(err))

            }
        }
    }

    const checkboxIDString = checkboxID.toString();
    return <div className={styles["fav__button"]}  >
        <div className={styles.checkbox} onClick={clickHandler}>
            <input ref={inputRef}  type="checkbox" id={checkboxIDString} />
            <label htmlFor={checkboxIDString}>
                <svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg">
                    <g id="Group" fill="none" fillRule="evenodd" transform="translate(467 392)">
                        <path
                            d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z"
                            id="heart" fill="#AAB8C2"/>
                        <circle id="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5"/>

                        <g id="grp7" opacity="0" transform="translate(7 6)">
                            <circle id="oval1" fill="#9CD8C3" cx="2" cy="6" r="2"/>
                            <circle id="oval2" fill="#8CE8C3" cx="5" cy="2" r="2"/>
                        </g>

                        <g id="grp6" opacity="0" transform="translate(0 28)">
                            <circle id="oval1" fill="#CC8EF5" cx="2" cy="7" r="2"/>
                            <circle id="oval2" fill="#91D2FA" cx="3" cy="2" r="2"/>
                        </g>

                        <g id="grp3" opacity="0" transform="translate(52 28)">
                            <circle id="oval2" fill="#9CD8C3" cx="2" cy="7" r="2"/>
                            <circle id="oval1" fill="#8CE8C3" cx="4" cy="2" r="2"/>
                        </g>

                        <g id="grp2" opacity="0" transform="translate(44 6)">
                            <circle id="oval2" fill="#CC8EF5" cx="5" cy="6" r="2"/>
                            <circle id="oval1" fill="#CC8EF5" cx="2" cy="2" r="2"/>
                        </g>

                        <g id="grp5" opacity="0" transform="translate(14 50)">
                            <circle id="oval1" fill="#91D2FA" cx="6" cy="5" r="2"/>
                            <circle id="oval2" fill="#91D2FA" cx="2" cy="2" r="2"/>
                        </g>

                        <g id="grp4" opacity="0" transform="translate(35 50)">
                            <circle id="oval1" fill="#F48EA7" cx="6" cy="5" r="2"/>
                            <circle id="oval2" fill="#F48EA7" cx="2" cy="2" r="2"/>
                        </g>

                        <g id="grp1" opacity="0" transform="translate(24)">
                            <circle id="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2"/>
                            <circle id="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2"/>
                        </g>
                    </g>
                </svg>
            </label>
        </div>
    </div>
}