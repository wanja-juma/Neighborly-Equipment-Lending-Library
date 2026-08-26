const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const borrowingRequestsRouter = require('./routes/borrowingRequests');
app.use('/api/borrowing-requests', borrowingRequestsRouter);

app.get('/', (req, res) => {
  res.send('Neighborly API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});