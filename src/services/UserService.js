import $api from "../http";

export default class UserService {
    static async getUser(userId) {
        return $api.get(`/users/find/${userId}`);
    }

    static async fetchUsers() {
        return $api.get(`/users`);
    }
}