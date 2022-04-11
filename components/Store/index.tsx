import React from "react";

const defaultValue = {
    activePage: "",
    setActivePage: (page: string) => {

    }
};

export const store = React.createContext(defaultValue);

export const StoreProvider = ({children}: { children: React.ReactNode }) => {
    const [activePage, setPage] = React.useState("");

    const setActivePage = (page: string) => {
        setPage(page);
    };

    return (
        <store.Provider value={{
            activePage,
            setActivePage
        }}>
            {children}
        </store.Provider>
    );

};
