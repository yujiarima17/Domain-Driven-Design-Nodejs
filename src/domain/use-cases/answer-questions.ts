import { Answer } from "../entities/answer";
import { AnswersRepository } from "../repositories/answer-respository";

interface AnswerQuestionUseCaseRequest {
	questionId: string;
	authorId: string;
	content: string;
}
export class AnswerQuestionUseCase {
	constructor(private answersRepository: AnswersRepository) {}
	async execute({
		questionId,
		authorId,
		content,
	}: AnswerQuestionUseCaseRequest) {
		const answer = new Answer({
			authorId,
			content,
			questionId,
		});

		await this.answersRepository.create(answer);
		
		return answer;
	}
}
