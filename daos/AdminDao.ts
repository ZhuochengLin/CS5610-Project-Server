import Admin from "../models/Admin";
import AdminModel from "../mongoose/AdminModel";

export default class AdminDao {

    private static adminDao: AdminDao | null = null;

    public static getInstance = () => {
        if (AdminDao.adminDao === null) {
            AdminDao.adminDao = new AdminDao();
        }
        return AdminDao.adminDao;
    }

    findAdmin = async (uname: string): Promise<Admin | null> => {
        return AdminModel.findOne({username: uname});
    }

    createAdmin = async (uname: string) => {
        return AdminModel.create({username: uname});
    }

    deleteAdmin = async (uname: string) => {
        return AdminModel.deleteOne({username: uname});
    }

    findAllAdmins = async () => {
        return AdminModel.find();
    }

}