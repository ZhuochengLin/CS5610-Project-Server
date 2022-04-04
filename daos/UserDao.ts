import UserModel from "../mongoose/UserModel";
import User from "../models/User";

class UserDao {

    private static userDao: UserDao | null = null;

    public static getInstance = () => {
        if (UserDao.userDao === null) {
            UserDao.userDao = new UserDao();
        }
        return UserDao.userDao;
    }

    createUser = async (user: User): Promise<User> => {
        return UserModel.create(user);
    }

    findAllUsers = async (): Promise<User[]> => {
        return UserModel.find({});
    }

    findUserById = async (uid: string): Promise<User | null> => {
        return UserModel.findOne({_id: uid});
    }

    deleteUserById = async (uid: string): Promise<any> => {
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