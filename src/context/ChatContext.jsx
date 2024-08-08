import { createContext, useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../utils/constants";

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
    const [sendMessageError, setSendMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);

    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    console.log({ onlineUsers });

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, [user]);

    useEffect(() => {
        if (socket === null) return;
        socket.emit("addNewUser", user?._id);
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off("getOnlineUsers");
        }
    }, [socket, user]);


    useEffect(() => {
        if (socket === null) return;
        const recipientId = currentChat?.members?.find((id) => id !== user?._id);
        socket.emit("sendMessage", { ...newMessage, recipientId });
    }, [newMessage]);

    useEffect(() => {
        if (socket === null) return;
        socket.on("getMessage", (res) => {
            if (currentChat?._id !== res.chatId) return;
            setMessages(prev => [...prev, res]);
        });

        return () => {
            socket.off("getMessage");
        }
    }, [socket, currentChat]);

    useEffect(() => {
        if (user?._id) {
            UserService.fetchUsers().then(res => {
                console.log(res.data);
                const pChats = res.data.filter((u) => {
                    let isChatCreated = false;
                    if (user._id === u._id) return false;
                    if (userChats) {
                        isChatCreated = userChats?.some((chat) => chat.members[0] === u._id || chat.members[1] === u._id);
                    }
                    return !isChatCreated;
                });
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
        setIsMessagesLoading(true);
        setMessagesError(null);
        console.log('currentChat : ', currentChat); //
        MessageService.getMessages(currentChat?._id).then(res => {
            setMessages(res.data);
            console.log({ msg: res.data });
        }).catch(err => {
            console.log(err);
            setMessagesError(err);
        }).finally(() => setIsMessagesLoading(false));
    }, [currentChat]);

    const sendMessage = useCallback((textMessage, senderId, currentChatId, setTextMessage) => {
        if (!textMessage) return;
        MessageService.createMessage({ chatId: currentChatId, senderId, text: textMessage })
            .then(res => {
                console.log(res.data);
                setNewMessage(res.data);
                setMessages(prev => [...prev, newMessage]);
                setTextMessage("");
            })
            .catch(err => {
                console.log(err);
                setSendMessageError(err);
            });
    }, []);

    const updateCurrentChat = (chat) => {
        setCurrentChat(chat);
        console.log({ chat });
    }

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
            currentChat,
            updateCurrentChat,
            messages,
            isMessagesLoading,
            messagesError,
            sendMessage,
            sendMessageError,
            onlineUsers,
        }}
    >
        {children}
    </ChatContext.Provider>
}