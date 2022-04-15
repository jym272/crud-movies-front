import {useContext, useEffect} from "react";
import {AddMovieForm, store} from "../../../../components";
import {Page} from "../../../../Types";

const Add = () => {

    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Add)
    }, [context])

    return <AddMovieForm movie={null}/>

}

export default Add