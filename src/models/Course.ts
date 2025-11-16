import { Schema, model, models } from "mongoose";
const CourseSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		slug: { type: String, required: true, unique: true },
		year: { type: String, enum: ["Y1", "Y2", "Y3"], required: true },
		isGlobal: { type: Boolean, default: false }, // pre-made by admin
		ownerId: { type: String, default: null }, // creator 
	},
	{ timestamps: true }
);
export default models.Course || model("Course", CourseSchema);
