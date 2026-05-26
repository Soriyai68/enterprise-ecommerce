const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Enterprise API Running' });
});

app.listen(5000);
