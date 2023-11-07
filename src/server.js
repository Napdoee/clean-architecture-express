const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const cors = require('cors');

const userController = require("./user/user.controller");
const errorHandler = require('./middleware/errorHandler');

const app = express();

dotenv.config();

const port = process.env.PORT || 5000;

const corsOptions = {
  // origin: true,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use(userController);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Welcome To API');
});

app.listen(port, () => console.log(`Server running at port http://localhost:${port}`));