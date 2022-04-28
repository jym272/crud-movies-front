import React, {useEffect} from "react";

const defaultValue = {
    activePage: "",
    setActivePage: (page: string) => {
    },
    darkMode: false,
    setDarkMode: (option: boolean) => {
    },
};

export const store = React.createContext(defaultValue);

export const StoreProvider = ({children}: { children: React.ReactNode }) => {
    const [activePage, setPage] = React.useState("");
    const [darkMode, _setDarkMode] = React.useState(false);
    useEffect(() => {
        const darkMode = localStorage.getItem("darkMode");
        if (darkMode) {
            const item = JSON.parse(darkMode);
            _setDarkMode(item.darkMode);
        }
    }, []);

    const setActivePage = (page: string) => {
        setPage(page);
    };


    const setDarkMode = (option: boolean) => {
        //set local storage
        const item = {
            darkMode: option,
        }
        localStorage.setItem('darkMode', JSON.stringify(item));
        _setDarkMode(option);
    };


    return (
        <store.Provider value={{
            activePage,
            setActivePage,
            darkMode,
            setDarkMode,
        }}>
            {children}
        </store.Provider>
    );

};
