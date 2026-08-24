import mongoose from "mongoose"

export const dbConnection = () => {
    const dbUrl = process.env.DB_ONLINE || process.env.DB_CONNECTION;

    mongoose.connect(dbUrl)
        .then(conn => console.log('DB Connected.....'))
        .catch((err) => console.log('errorrr DataBase', err))
}
