const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.json({ message: 'Test works' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
