import {useContext, useEffect} from "react";
import {store} from "../../components";
import {Page} from "../../Types";

const Catalog = () => {
    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Catalog)
    }, [context])
    return (
        <div>
            <h1>Catalog</h1>
        </div>
    )
}
export default Catalog