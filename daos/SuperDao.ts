import SuperModel from "../mongoose/SuperModel";

export default class SuperDao {

    private static superDao: SuperDao | null = null;

    private constructor() {
    }

    public static getInstance = () => {
        if (SuperDao.superDao === null) {
            SuperDao.superDao = new SuperDao();
        }
        return SuperDao.superDao;
    }

    findSuper = async (uname: string) => {
        return SuperModel.findOne({username: uname});
    }

    findAllSupers = async () => {
        return SuperModel.find({});
    }

}