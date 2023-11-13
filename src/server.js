const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const cors = require('cors');

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

const routers = require('./router');
app.use("/api/v1", routers);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(port, () => console.log(`Server listening to port ${port}`));