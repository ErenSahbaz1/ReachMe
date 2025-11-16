import { Schema, model, models, Types } from "mongoose";
const AttemptSchema = new Schema(
	{
		userId: { type: String, required: true },
		quizId: { type: Types.ObjectId, ref: "Quiz", required: true },
		answers: [{ qIndex: Number, selectedIndex: Number }],
		score: Number,
		total: Number,
	},
	{ timestamps: { createdAt: "startedAt", updatedAt: "finishedAt" } }
);
AttemptSchema.index({ userId: 1, finishedAt: -1 });
AttemptSchema.index({ quizId: 1, finishedAt: -1 });
export default models.Attempt || model("Attempt", AttemptSchema);
