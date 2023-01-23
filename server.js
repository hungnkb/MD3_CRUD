const http = require('http');
const fs = require('fs');
const qs = require('qs');
const url = require('url')
const { handlers } = require('./controller/handlers')

const server = http.createServer((req, res) => {
    let getUrl = url.parse(req.url, true);
    let id = qs.parse(getUrl.query).id
    switch (getUrl.pathname) {
        case '/products':
        case '/':
            handlers.showProducts(req, res);
            break;
        case '/addItem':
            if (req.method == 'GET') {
                handlers.showAddItemPage(req, res);
            } else {
                handlers.addItem(req, res);
            };
            break;
        case '/delete':
            handlers.delete(id, req, res);
            break;
        case '/edit':
            if (req.method == 'GET') {
                handlers.showEditItemPage(id, req, res);
            } else {
                handlers.edit(id, req, res);
            };
            break;
        default:
            res.end('home')
    }
})

server.listen(8080, () => {
    console.log('Server is running at localhost:8080');
})
