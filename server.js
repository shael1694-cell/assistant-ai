import express from "express"
import bodyParser from "body-parser"
import OpenAI from "openai"
import "dotenv/config"

const app = express()
app.use(bodyParser.json())

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

app.post("/ask", async (req, res) => {
  const { question, hintCount, userRequestedAnswer } = req.body

  if (userRequestedAnswer) {
    return res.json({ response: "I am here to help u not to give answers" })
  }

  if (hintCount < 3) {
    const completion = await client.chat.completions.create({
      model: "gpt-5.1-mini",
      messages: [
        { role: "system", content: "Give short helpful hints. No answers." },
        { role: "user", content: question }
      ]
    })

    return res.json({
      response: completion.choices[0].message.content,
      solved: false
    })
  }

  const completion = await client.chat.completions.create({
    model: "gpt-5.1",
    messages: [
      { role: "system", content: "Give the final answer with explanation in simple steps." },
      { role: "user", content: question }
    ]
  })

  res.json({
    response: completion.choices[0].message.content,
    solved: true
  })
})

app.listen(4000, () => {
  console.log("AI running on port 4000")
})
