import { ICreateUser, userModel } from "../../models/User";
class AuthService {

    async getUserByEmail(email: string) {
        const user = await userModel.findOne({ email: email || "" });
        return user === null ? null : user.toJSON();
    }
    async createUser(userData: ICreateUser) {
        const user = await userModel.create(userData);
        return user.toJSON();
    }
    async deleteUserByEmail(email: string) {
        let deleted = await userModel.deleteOne({ email: email });
        return deleted.deletedCount > 0;
    }

    async updatePasswordByEmail(email: string, password: string) {
        let updated = await userModel.updateOne({ email: email || "" }, { passwordHash: password });
        return updated.matchedCount > 0;
    }
}

export default AuthService;