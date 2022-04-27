import {useContext, useEffect} from "react";
import {AboutComponent, store} from "../../components";
import {Page} from "../../Types";

const AboutPage = () => {

    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.About)
    }, [context])

    return <AboutComponent/>
}

export default AboutPage