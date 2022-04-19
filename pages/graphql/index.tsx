import {useContext, useEffect} from "react";
import {Page} from "../../Types";
import {GraphQLComponent, store} from "../../components";


const Graphql = () => {
    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.GraphQL)
    }, [context])


    return <GraphQLComponent/>

}
export default Graphql