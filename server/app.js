const express = require('express')
const app = express()
require('dotenv').config()
app.use(express.urlencoded({extended: true}))
app.use(express.json());
const openai = require('openai');
const Message = require('./model/chat')

const http = require('http').createServer(app); 
const io = require('socket.io')(http);


const port = process.env.PORT || 8000
const db = require('./Config/dataBase')
const mongoURL = process.env.MongoDB_URL

//here openAI setup


const openaiApiKey = process.env.OPENAI_API_KEY

const openaiClient = new openai({ key: openaiApiKey });


//socket connection
io.on('connection', (socket) => {

    socket.on('userMessage', async (message) => {
  
        try {
          const openaiResponse = await openaiClient.completions.create({
            prompt: message,
            max_tokens: 50, 
            model:"text-davinci-002"
          }
          
          )
    
          const chatbotReply = openaiResponse.choices[0].text;
    
          socket.emit('botMessage', chatbotReply);
          const userMessage = new Message({
            text: message,
            sender: 'user',
        });
        const botMessage = new Message({
            text: chatbotReply,
            sender: 'chatbot',
        });

        await Promise.all([userMessage.save(), botMessage.save()]);
        } catch (error) {
          console.error('Error sending message to OpenAI:', error);
        }
      }); 

  
  });


const appEndPoint = async(url)=>{
    try {
        await db.connectDb(url)
        http.listen(port,()=>{console.log(`App connected to db and listening at port ${port}`)})
    } catch (error) {   
        console.log(error)
    }

}
appEndPoint(mongoURL)