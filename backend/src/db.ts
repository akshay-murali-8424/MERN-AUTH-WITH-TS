import mongoose from "mongoose"
mongoose.set('strictQuery',true)

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE!)
    console.log(`Database connected successfully`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export default connectDB