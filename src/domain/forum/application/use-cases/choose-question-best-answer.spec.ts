import { expect } from "vitest";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { makeQuestion } from "test/factories/make-question";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Choose Question Best Answer", () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		sut = new ChooseQuestionBestAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryQuestionsRepository
		);
	});

	it("should be able to choose the question best answer", async () => {
		const question = makeQuestion();
		const answer = makeAnswer({
			questionId: question.id,
		});

		await inMemoryQuestionsRepository.create(question);
		await inMemoryAnswersRepository.create(answer);

		await sut.execute({
			answerId: answer.id.toString(),
			authorId: question.authorId.toString(),
		});

		expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(
			answer.id
		);
	});

	it("should not be able to choose the question best answer", async () => {
		const question = makeQuestion({
			authorId: new UniqueEntityId("author-1"),
		});
		
		const answer = makeAnswer({
			questionId: question.id,
		});

		await inMemoryQuestionsRepository.create(question);
		await inMemoryAnswersRepository.create(answer);

		await expect(() =>
			sut.execute({
				authorId: "author-2",
				answerId: answer.id.toString(),
			})
		).rejects.toBeInstanceOf(Error);
	});
});
