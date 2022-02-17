const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();

const apiRoutes = require('./src/modules/routes/routes');

const dbUrl = 'mongodb+srv://timmyhurtful:restart987@cluster0.qiabf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const PORT = 8000;

try {
  mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
} catch(error) {
  res.status(500).send('Internal server error');
}

app.use(bodyParser());
app.use(cors());
app.use("/", apiRoutes);

app.listen(PORT, () => {
  console.log(`The server is working on port ${PORT}.`);
});
