import $api from "../http";

export default class AuthService {
    static async register(info) {
        return $api.post('/auth/register', info);
    }

    static async login(info) {
        return $api.post('/auth/login', info);
    }
}