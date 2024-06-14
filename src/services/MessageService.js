import $api from "../http";

export default class AuthService {
    static async createMessage(msgInfo) {
        return $api.post(`/message`, msgInfo);
    }

    static async getMessages(chatId = 0) {
        return $api.get(`/message/${chatId}`);
    }
}