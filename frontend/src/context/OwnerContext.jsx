import { createContext, useContext, useState } from "react";

const OwnerContext = createContext();

export const OwnerProvider = ({children}) => {

    const [ownerName, setOwnerName] = useState("");
    const [numberOfUser, setNumberOfUser] = useState("");

    const toggleDetails = (roomName, roomNumber) => {

        setOwnerName(roomName);
        setNumberOfUser(roomNumber);
    };

    return (
        <OwnerContext.Provider value={{ownerName, numberOfUser, toggleDetails}}>
            {children}
        </OwnerContext.Provider>
    );
};

export const useOwnerName = () => useContext(OwnerContext);