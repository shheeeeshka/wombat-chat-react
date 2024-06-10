import $api from "../http";

export default class AuthService {
    static async createMessage() {
        return $api.post(`/message`);
    }

    static async getMessages(chatId = 0) {
        return $api.get(`/message/${chatId}`);
    }
}