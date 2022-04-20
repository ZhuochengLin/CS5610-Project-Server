import UserModel from "../mongoose/UserModel";
import User from "../models/User";

const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserDao {

    private static userDao: UserDao | null = null;

    public static getInstance = () => {
        if (UserDao.userDao === null) {
            UserDao.userDao = new UserDao();
        }
        return UserDao.userDao;
    }

    createUser = async (user: User): Promise<User> => {
        const password = user.password;
        user.password = await bcrypt.hash(password, saltRounds);
        return UserModel.create(user);
    }

    findAllUsers = async (): Promise<User[]> => {
        return UserModel.find({}).sort({"joined": -1});
    }

    findUserById = async (uid: string): Promise<User | null> => {
        return UserModel.findOne({_id: uid});
    }

    findUserByUsername = async (uname: string): Promise<User | null> => {
        return UserModel.findOne({username: uname});
    }


    deleteUser = async (uid: string): Promise<any> => {
        return UserModel.deleteOne({_id: uid});
    }

    deleteAllUsers = async (): Promise<any> => {
        return UserModel.deleteMany({});
    }

    updateUser = async (uid: string, user: User): Promise<any> => {
        return UserModel.updateOne({_id: uid}, {$set: user});
    }

}

export default UserDao;