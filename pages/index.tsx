import {useContext, useEffect} from "react";
import {FrontPage, store} from "../components";
import {Page} from "../Types";

const Home = () => {
    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Home)
    }, [context])
    return <FrontPage/>
};

export default Home;