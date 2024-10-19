const {getTransactions} = require("./getTransactions");
const Tx = require("../models/Tx");
const User = require("../models/User");
const {Address} = require("tonweb");
const UserCourse = require("../models/UserCourse");
const Course = require("../models/Course");
const UserBalanceHistory = require('../models/UserBalanceHistory');


const handleTransactions = async () => {
    console.log("Checking transactions");
    const transactions = await getTransactions("UQBrKi-UxyCvspTDZaLWrthLmiovK326gSLSKo2vyvzLr-w9");

    try {
        for (const transaction of transactions) {
            if (transaction.in_progress) {
                continue;
            }
            const findTx = await Tx.findOne({id: transaction.event_id});


            if (!findTx) {
                const newTx = new Tx({
                    id: transaction.event_id
                });

                await newTx.save();
                console.log('New transaction found', transaction.event_id);

                if (transaction.actions[0]) {
                    console.log('Action:', transaction.actions[0].type);


                    if (transaction.actions[0].type === 'TonTransfer') {

                    }

                    if (transaction.actions[0].type === 'JettonTransfer') {
                        if (transaction.actions[0].JettonTransfer.recipient.address == "0:7256e4a482131f97e1e0bd4ecc56a031df995441e842a03ae37647cd3c955b56") {
                            console.log('JettonTransfer');

                            if (transaction.actions[0].JettonTransfer.jetton.address != "0:b113a994b5024a16719f69139328eb759596c38a25f59028b146fecdc3621dfe") {
                                console.log('Wrong jetton address');
                                continue;
                            }

                            const info = transaction.actions[0].JettonTransfer.comment.split('-');

                            const course = await Course.findOne({
                                _id: info[2]
                            });

                            if (course) {
                                console.log('Course found:', course._id);

                                if (course.currency.toLowerCase() !== 'usd') {
                                    console.log('Wrong currency');
                                    continue;
                                }

                                if (transaction.actions[0].JettonTransfer.amount < course.price * Math.pow(10, 6)) {
                                    console.log('Not enough amount');
                                    continue;
                                }

                                const user = await User.findOne({
                                    _id: info[1]
                                });

                                if (!user) {
                                    console.log('User not found');
                                    continue;
                                }

                                console.log('User found:', user._id);

                                const newCourse = new UserCourse({
                                    courseId: course._id,
                                    userId: user._id,
                                    status: "pending"
                                })


                                const newHistory = new UserBalanceHistory({
                                    userId: user._id,
                                    title: "Course purchase",
                                    type: "in",
                                    data: {
                                        courseId: course._id

                                    },
                                    amount: course.price,
                                    createdAt: new Date()
                                })

                                await newHistory.save()
                                await newCourse.save()

                                // send message in telegram

                                req.bot.telegram.sendMessage(user.uid, `You have successfully purchased the course ${course.title}`)
                                console.log('Course added to user:', user._id);
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error handling transactions:', error);
    }
}

module.exports = {
    handleTransactions
};