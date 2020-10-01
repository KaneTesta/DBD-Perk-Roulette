const express = require('express');
const path = require('path');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = (process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.use('/perks', createProxyMiddleware({ target: ' https://dbd-api.herokuapp.com', changeOrigin: true }));
app.use('/api/offerings', createProxyMiddleware({ target: 'https://dbd-stats.info/', changeOrigin: true }));
app.use('/api/items', createProxyMiddleware({ target: 'https://dbd-stats.info/', changeOrigin: true }));
app.use('/api/itemaddons', createProxyMiddleware({ target: 'https://dbd-stats.info/', changeOrigin: true }));

app.use(express.static(path.join(__dirname, 'client/build')));


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})