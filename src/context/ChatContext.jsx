import { createContext, useCallback, useEffect, useState } from "react";

import UserService from "../services/UserService";
import ChatService from "../services/ChatService";
import MessageService from "../services/MessageService";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [chatError, setChatError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);

    const [messages, setMessages] = useState([]);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);

    useEffect(() => {
        if (user?._id) {
            UserService.fetchUsers().then(res => {
                console.log(res.data);
                const pChats = res.data.filter(u => u._id !== user?._id && userChats && userChats?.some(chat => chat.members[0] !== u._id && chat.members[1] !== u._id));
                setPotentialChats(pChats);
            }).catch(err => {
                setChatError(err);
                console.log(err);
            });
        }
    }, [userChats, user]);

    useEffect(() => {
        if (user?._id) {
            setIsUserChatsLoading(true);
            ChatService.fetchChats(user._id).then(res => {
                setUserChats(res.data);
            }).catch(err => {
                console.log(err);
                setChatError(err);
            }).finally(() => setIsUserChatsLoading(false));
        }
    }, [user]);

    useEffect(() => {
        if (currentChat?._id) {
            setIsMessagesLoading(true);
            setMessagesError(null);
            MessageService.getMessages(currentChat?._id).then(res => {
                setMessages(res.data);
                console.log({ msg: res.data });
            }).catch(err => {
                console.log(err);
                setMessagesError(err);
            }).finally(() => setIsMessagesLoading(false));
        }
    }, [currentChat]);

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    }, []);

    const createChat = useCallback(async (firstId, secondId) => {
        ChatService.createChat({ firstId, secondId })
            .then(res => {
                setUserChats(prev => [...prev, res.data]);
                console.log(res.data);
            })
            .catch(err => alert('An error occured while creating chat' + err));
    }, []);

    return <ChatContext.Provider
        value={{
            userChats,
            isUserChatsLoading,
            chatError,
            potentialChats,
            createChat,
            updateCurrentChat,
            messages,
            isMessagesLoading,
            messagesError
        }}
    >
        {children}
    </ChatContext.Provider>
}