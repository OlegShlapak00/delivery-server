const express = require("express");
const mongoose = require("mongoose");
const app = express();

const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const truckRouter = require('./routers/truckRouter');
const loadRouter = require('./routers/loadRouter');

mongoose.connect(`mongodb+srv://user:12345@cluster0.hnyca.mongodb.net/NODEJS_HW3?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

app.use(express.json());

app.use("/api",authRouter);
app.use("/api",userRouter);
app.use("/api",truckRouter);
app.use("/api",loadRouter)


app.listen(8080||process.env.PORT , () => console.log("listening"));
