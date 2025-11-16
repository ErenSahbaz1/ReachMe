import { Schema, model, models, Types } from "mongoose";
const Question = new Schema(
	{
		text: { type: String, required: true },
		options: { type: [String], validate: (v) => v.length >= 2, required: true },
		correctIndex: { type: Number, required: true, min: 0 },
		imageKey: { type: String },
	},
	{ _id: false }
);

const QuizSchema = new Schema(
	{
		ownerId: { type: String, required: true },
		title: { type: String, required: true, trim: true },
		description: { type: String, default: "" },
		courseId: { type: Types.ObjectId, ref: "Course", required: true },
		year: { type: String, enum: ["Y1", "Y2", "Y3"], required: true },
		visibility: {
			type: String,
			enum: ["public", "private"],
			default: "public",
		},
		questions: { type: [Question], default: [] },
	},
	{ timestamps: true }
);
QuizSchema.index({ visibility: 1, year: 1, createdAt: -1 });
QuizSchema.index({ ownerId: 1, createdAt: -1 });
export default models.Quiz || model("Quiz", QuizSchema);
