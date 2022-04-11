import {useContext, useEffect} from "react";
import {store} from "../components";
import {Page} from "../Types";

const Home = () => {
    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Home)
    }, [context])
    return (
        <div>
            <h1>Home</h1>
        </div>
    );
};

export default Home;