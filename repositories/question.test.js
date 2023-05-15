const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeEach(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterEach(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('should return a question by id', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const question = await questionRepo.getQuestionById(testQuestions[0].id)

    expect(question).toEqual(testQuestions[0])
  })

  test('should add a question', async () => {
    const testQuestion = {
      summary: 'What is my name?',
      author: 'Jack London',
      answers: []
    }

    const addedQuestion = await questionRepo.addQuestion(testQuestion)
    const questions = await questionRepo.getQuestions()

    expect(questions).toHaveLength(1)
    expect(addedQuestion).toEqual(questions[0])
  })

  test('should return a list of 0 answers', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const answers = await questionRepo.getAnswers(testQuestions[0].id)

    expect(answers).toHaveLength(0)
  })

  test('should return a list of 2 answers', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        author: 'John Stockton',
        summary: 'What is the shape of the Earth?',
        answers: [
          {
            id: faker.datatype.uuid(),
            author: 'Brian McKenzie',
            summary: 'The Earth is flat.'
          },
          {
            id: faker.datatype.uuid(),
            author: 'Dr Strange',
            summary: 'It is egg-shaped.'
          }
        ]
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const answers = await questionRepo.getAnswers(testQuestions[0].id)

    expect(answers).toHaveLength(2)
  })

  test('should return an answer by id', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        author: 'John Stockton',
        summary: 'What is the shape of the Earth?',
        answers: [
          {
            id: faker.datatype.uuid(),
            author: 'Brian McKenzie',
            summary: 'The Earth is flat.'
          },
          {
            id: faker.datatype.uuid(),
            author: 'Dr Strange',
            summary: 'It is egg-shaped.'
          }
        ]
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const answer = await questionRepo.getAnswer(
      testQuestions[0].id,
      testQuestions[0].answers[0].id
    )

    expect([answer]).toHaveLength(1)
    expect(answer).toEqual(testQuestions[0].answers[0])
    expect(answer).not.toEqual(testQuestions[0].answers[1])
  })

  test('should add an answer', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        author: 'John Stockton',
        summary: 'What is the shape of the Earth?',
        answers: [
          {
            id: faker.datatype.uuid(),
            author: 'Brian McKenzie',
            summary: 'The Earth is flat.'
          }
        ]
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const answer = {
      author: 'Dr Strange',
      summary: 'It is egg-shaped.'
    }

    await questionRepo.addAnswer(testQuestions[0].id, answer)

    const answers = await questionRepo.getAnswers(testQuestions[0].id)

    expect(answers).toHaveLength(2)
    expect(answers).toEqual(
      expect.arrayContaining([expect.objectContaining(answer)])
    )
  })
})
