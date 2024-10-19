const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const {Telegraf, Markup} = require('telegraf');
const cron = require('node-cron');
const cookieParser = require('cookie-parser');

const {handleTransactions} = require('./helpers/handleTransactions');

dotenv.config();

const apiRouter = require('./routes/api');
const adminRouter = require('./routes/adminApi');

const app = express();
const port = process.env.PORT || 3000;
const bot = new Telegraf(process.env.BOT_TOKEN);

app.set('view engine', 'ejs');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use((req, res, next) => {
    req.bot = bot;
    next();
});

app.use('/api', apiRouter);
app.use('/admin', adminRouter);

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to the database');
});

app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
})

const k = Markup.inlineKeyboard([
    Markup.button.webApp("Open app", "https://dl.km-dev.tech/")
]);


bot.start(async (ctx) => {
    try {
        const msg = await ctx.replyWithPhoto("https://i.imgur.com/pb9LSfd.jpeg", {
            caption: `🚀 Welcome to DecentraLearn!\n\nGet access to over 100 courses directly from Telegram. Earn $DC token and withdraw it directly to your TON wallet. Get Soulbound NFT for every course you take\n\nLaunch our app and start learning something new today! 👇👇👇`,
            parse_mode: "HTML",
            ...k
        });

        await ctx.pinChatMessage(msg.message_id);
    } catch (error) {
        console.error("Error sending the message:", error);
    }
});

bot.launch();

// handleTransactions()

// cron.schedule('*/1 * * * *', () => { // every minute
//     handleTransactions()
// })



