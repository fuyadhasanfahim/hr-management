import { connection } from 'mongoose';

const UserModel = connection.collection('user');
export default UserModel;
