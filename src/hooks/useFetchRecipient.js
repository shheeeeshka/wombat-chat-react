import { useEffect, useState } from "react";
import UserService from "../services/UserService";

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);

    const recipientId = chat?.members?.find(id => id !== user?._id);

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return null;

            const { data } = await UserService.getUser(recipientId);

            setRecipientUser(data);

            console.log({ data });
        }

        getUser();
    }, [recipientId]);

    return {
        recipientUser,
        error,
    }
}