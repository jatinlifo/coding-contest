import mongoose from 'mongoose'

const connectDB = async () => {

    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`\n Mongo DB atlas connected || DB HOST: ${connectionInstance.connection.host} `);
    } catch (error) {
        console.log("Mongo DB connections Failed on atlas", error)
    }
}

export default connectDB;