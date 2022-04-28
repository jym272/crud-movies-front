import {useContext, useEffect} from "react";
import {AddMovieForm, store} from "../../../../components";
import {ComponentWithAuth, Page} from "../../../../Types";

const Add: ComponentWithAuth = () => {

    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Add)
    }, [context])

    return <AddMovieForm movie={null}/>

}


export default Add

Add.auth = true //client side auth