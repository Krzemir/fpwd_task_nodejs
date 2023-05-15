const { readFile, writeFile } = require('fs/promises')
const { v4: uuid } = require('uuid')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    const question = questions.find(q => q.id === questionId)

    return question
  }
  const addQuestion = async questionData => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    const question = {
      id: uuid(),
      ...questionData,
      answers: []
    }
    questions.push(question)

    await writeFile(fileName, JSON.stringify([questions], null, '\t'))
    return questions
  }

  const getAnswers = async questionId => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    const question = questions.find(q => q.id === questionId)

    return question.answers
  }

  const getAnswer = async (questionId, answerId) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    const question = questions.find(q => q.id === questionId)
    const answer = question.answers.find(a => a.id === answerId)

    return answer
  }

  const addAnswer = async (questionId, answer) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    const question = questions.find(q => q.id === questionId)
    const answerData = {
      id: uuid(),
      ...answer
    }

    question.answers.push(answerData)

    await writeFile(fileName, JSON.stringify(questions, null, '\t'))
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
