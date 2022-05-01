import {useContext, useEffect} from "react";
import {store} from "../../components";
import {Page} from "../../Types";

const FavPage = () => {

    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Fav)
    }, [context])

    return (
        <div>
            <h1>Fav Page</h1>
        </div>
    )
}

export default FavPage