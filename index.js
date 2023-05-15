const express = require('express')
const { urlencoded, json } = require('body-parser')
const { validate, ValidationError } = require('express-validation')
const Joi = require('joi')

const makeRepositories = require('./middleware/repositories')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

// Data validation
const addQuestionValidationSchema = {
  body: Joi.object({
    summary: Joi.string().required(),
    author: Joi.string().required(),
    answers: Joi.array().items(Joi.string()).optional()
  })
}

const addAnswerValidationSchema = {
  body: Joi.object({
    author: Joi.string().required(),
    summary: Joi.string().required()
  })
}

// Routes

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  try {
    const questions = await req.repositories.questionRepo.getQuestions()
    res.json(questions)
  } catch (error) {
    console.error('Error occurred while retrieving questions:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/questions/:questionId', async (req, res) => {
  try {
    const question = await req.repositories.questionRepo.getQuestionById(
      req.params.questionId
    )
    if (!question) {
      res.status(404).json({ error: 'Question not found' })
    } else {
      res.json(question)
    }
  } catch (error) {
    console.error('Error occurred while retrieving question by ID:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.post('/questions', validate(addQuestionValidationSchema), (req, res) => {
  try {
    const questionData = req.body
    req.repositories.questionRepo.addQuestion(questionData)

    res.status(201).json({ message: 'Question added' })
  } catch (error) {
    console.error('Error occurred while adding a question:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/questions/:questionId/answers', async (req, res) => {
  try {
    const answers = await req.repositories.questionRepo.getAnswers(
      req.params.questionId
    )
    res.json(answers)
  } catch (error) {
    console.error('Error occurred while retrieving answers:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.post(
  '/questions/:questionId/answers',
  validate(addAnswerValidationSchema),
  (req, res) => {
    try {
      const answer = req.body
      req.repositories.questionRepo.addAnswer(req.params.questionId, answer)

      res.status(201).json({ message: 'Answer added' })
    } catch (error) {
      console.error('Error occurred while adding an answer:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
)

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  try {
    const answer = await req.repositories.questionRepo.getAnswer(
      req.params.questionId,
      req.params.answerId
    )
    if (!answer) {
      res.status(404).json({ error: 'Answer not found' })
    } else {
      res.json(answer)
    }
  } catch (error) {
    console.error('Error occurred while retrieving answer by ID:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Validation errors handling
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    console.error('Validation error occurred:', err.details)
    return res.status(400).json({ error: 'Check your data' })
  }

  console.error('Unhandled error occurred:', err)
  res.status(500).json({ error: 'Internal Server Error' })
})

// port establishment

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
