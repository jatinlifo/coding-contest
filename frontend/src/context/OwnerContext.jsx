import { createContext, useContext, useState } from "react";

const OwnerContext = createContext();

export const OwnerProvider = ({ children }) => {

    const [ownerName, setOwnerName] = useState("");
    const [numberOfUser, setNumberOfUser] = useState("");

    const toggleDetails = (roomName, roomNumber) => {

        console.log("RoomName", roomName);
        console.log("RoomNumber", roomNumber);

        setOwnerName(roomName);
        setNumberOfUser(roomNumber);

        // console.log("On", ownerName);
        // console.log("NO", numberOfUser);

        // useEffect(() => {
        //     console.log("After ownerName update:", ownerName);
        // }, [ownerName]);
        // useEffect(() => {
        //     console.log("After numberOfUser update:", numberOfUser);
        // }, [numberOfUser]);;
    };

    return (
        <OwnerContext.Provider value={{ ownerName, numberOfUser, toggleDetails }}>
            {children}
        </OwnerContext.Provider>
    );
};

export const useOwnerName = () => useContext(OwnerContext);