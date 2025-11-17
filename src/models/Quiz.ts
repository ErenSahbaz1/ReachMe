import { Schema, model, models, InferSchemaType } from "mongoose";

const Question = new Schema(
	{
		text: { type: String, required: true },
		options: { type: [String], required: true },
		correctIndex: { type: Number, required: true },
		imageKey: String,
	},
	{ _id: false }
);

const QuizSchema = new Schema(
	{
		ownerId: { type: String, required: true },
		title: { type: String, required: true },
		description: String,
		courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
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

export type QuizDoc = InferSchemaType<typeof QuizSchema>;
export default models.Quiz || model<QuizDoc>("Quiz", QuizSchema);
