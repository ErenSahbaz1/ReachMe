import { Schema, model, models, Document, Types } from "mongoose";

/**
 * 📝 QUESTION SCHEMA
 *
 * Each question in a quiz has:
 * - text: The question itself
 * - options: Array of possible answers (e.g., ["A", "B", "C", "D"])
 * - correctIndex: Which option is correct (0-based, so 0 = first option)
 * - explanation: Optional hint shown after answering
 */
const QuestionSchema = new Schema({
	text: {
		type: String,
		required: [true, "Question text is required"],
		trim: true,
		minlength: [5, "Question must be at least 5 characters"],
	},
	options: {
		type: [String],
		required: [true, "Options are required"],
		validate: {
			validator: (arr: string[]) => arr.length >= 2 && arr.length <= 6,
			message: "Must have 2-6 options",
		},
	},
	correctIndex: {
		type: Number,
		required: [true, "Correct answer index is required"],
		min: [0, "Index must be >= 0"],
		// Validated in pre-save hook below
	},
	explanation: {
		type: String,
		trim: true,
	},
});

/**
 * 🎯 QUIZ INTERFACE (TypeScript)
 *
 * Defines the shape of a Quiz document
 * Document = adds MongoDB fields like _id, createdAt, etc.
 */
export interface IQuiz extends Document {
	ownerId: Types.ObjectId; // Who created this quiz
	title: string;
	description?: string;
	questions: Array<{
		text: string;
		options: string[];
		correctIndex: number;
		explanation?: string;
	}>;
	visibility: "public" | "private";
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}

/**
 * 🏗️ QUIZ SCHEMA (Database Structure)
 *
 * This defines:
 * - What fields exist
 * - Validation rules
 * - Default values
 * - Indexes for fast queries
 */
const QuizSchema = new Schema<IQuiz>(
	{
		ownerId: {
			type: Schema.Types.ObjectId,
			ref: "User", // 🔗 References the User model
			required: [true, "Owner is required"],
			index: true, // Fast lookup by owner
		},
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
			minlength: [3, "Title must be at least 3 characters"],
			maxlength: [100, "Title must be less than 100 characters"],
			index: true, // Fast search by title
		},
		description: {
			type: String,
			trim: true,
			maxlength: [500, "Description must be less than 500 characters"],
		},
		questions: {
			type: [QuestionSchema],
			required: [true, "Questions are required"],
			validate: {
				validator: (arr: any[]) => arr.length >= 1,
				message: "Quiz must have at least 1 question",
			},
		},
		visibility: {
			type: String,
			enum: {
				values: ["public", "private"],
				message: "{VALUE} is not a valid visibility",
			},
			default: "public",
			index: true, // Fast filtering by visibility
		},
		tags: {
			type: [String],
			default: [],
			validate: {
				validator: (arr: string[]) => arr.length <= 10,
				message: "Maximum 10 tags allowed",
			},
		},
	},
	{
		timestamps: true, // Auto-add createdAt and updatedAt
	}
);

/**
 * ⚙️ PRE-SAVE HOOK (runs before saving)
 *
 * VALIDATION: Ensure correctIndex is valid for each question
 * WHY: Mongoose can't validate across fields in schema
 */
QuizSchema.pre("save", function (next) {
	for (const question of this.questions) {
		if (question.correctIndex >= question.options.length) {
			return next(
				new Error(
					`correctIndex ${question.correctIndex} is out of range for question with ${question.options.length} options`
				)
			);
		}
	}
	next();
});

/**
 * 📊 INDEXES FOR PERFORMANCE
 *
 * Compound index: Find quizzes by owner AND visibility quickly
 * Use case: "Show me all MY public quizzes"
 */
QuizSchema.index({ ownerId: 1, visibility: 1 });
QuizSchema.index({ createdAt: -1 }); // Sort by newest first

/**
 * 🎁 EXPORT WITH HOT-RELOAD GUARD
 */
const Quiz = models.Quiz || model<IQuiz>("Quiz", QuizSchema);
export default Quiz;
