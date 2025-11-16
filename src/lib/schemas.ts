import { z } from "zod";

export const YearEnum = z.enum(["Y1", "Y2", "Y3"]);
export const VisibilityEnum = z.enum(["public", "private"]);

export const QuestionSchema = z.object({
	text: z.string().min(1),
	options: z.array(z.string().min(1)).min(2),
	correctIndex: z.number().int().nonnegative(),
	imageKey: z.string().optional(),
});

export const CreateCourseSchema = z.object({
	name: z.string().min(2),
	year: YearEnum,
});

export const CreateQuizSchema = z.object({
	title: z.string().min(2),
	description: z.string().optional(),
	courseId: z.string(), // ObjectId as string
	year: YearEnum,
	visibility: VisibilityEnum,
	questions: z.array(QuestionSchema).min(1),
});
