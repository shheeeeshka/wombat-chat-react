import $api from "../http";

export default class AuthService {
    static async createChat(chatInfo) {
        return $api.post(`/chat`, chatInfo);
    }

    static async findChat(firstId, secondId) {
        return $api.get(`/chat/${firstId}/${secondId}`);
    }

    static async fetchChats(userId) {
        return $api.get(`/chat/${userId}`);
    }
}