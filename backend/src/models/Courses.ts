import mongoose, { Document, Schema } from "mongoose";

// CHECK COLUMNS.ts

interface ICourse extends Document {
    name: string,
    teacher: string,
    subject: string,
    likes: string,
    Dislikes: string
}

let courseSchema: Schema = new Schema({
    name: { type: String, required: true },
    teacher: { type: String, required: true },
    subject: { type: String, required: true },
    likes: { type: Number, default: 0 },
    Dislikes: { type: Number, default: 0 }
})

const courses: mongoose.Model<ICourse> = mongoose.model<ICourse>("courses", courseSchema)

export {courses, ICourse}