import { expect } from "vitest";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { FetchLatestQuestionsUseCase } from "./fetch-latest-questions";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: FetchLatestQuestionsUseCase;

describe("Fetch Recent Questions", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository
		);
		sut = new FetchLatestQuestionsUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to fetch latest questions", async () => {
		await inMemoryQuestionsRepository.create(
			makeQuestion({ createdAt: new Date(2022, 0, 20) })
		);

		await inMemoryQuestionsRepository.create(
			makeQuestion({ createdAt: new Date(2022, 0, 18) })
		);

		await inMemoryQuestionsRepository.create(
			makeQuestion({ createdAt: new Date(2022, 0, 23) })
		);

		const result = await sut.execute({
			page: 1,
		});

		expect(result.value?.questions).toEqual([
			expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
		]);
	});

	it("should be able to fetch paginated latest questions", async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryQuestionsRepository.create(makeQuestion());
		}

		const result = await sut.execute({
			page: 2,
		});

		expect(result.value?.questions).toHaveLength(2);
	});
});
