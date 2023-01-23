const fs = require('fs');
const qs = require('qs')
const http = require('http')

let handlers = {};
handlers.showProducts = (req, res) => {
    let html = '';
    fs.readFile('./data/data.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err.message);
        } else {
            data = JSON.parse(data);
            data.forEach((item) => {
                html += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td><a onclick="return confirm('Are you sure to delete this item?')" href="/delete?id=${item.id}"><button type="button" class="btn btn-danger">Delete</button></a> <a href="/edit?id=${item.id}"><button type="button" class="btn btn-primary">Update</button></a></td>
                </tr>
                `
            });
            fs.readFile('./views/products.html', 'utf8', (err, data) => {
                if (err) {
                    console.log(err.message);
                } else {
                    data = data.replace('{item-list}', html);
                    res.write(data);
                    res.end()
                }
            });

        }
    })
}

handlers.addItem = (req, res) => {
    let newItem = '';
    req.on('data', chunk => {
        newItem += chunk;
    })
    req.on('end', () => {
        let itemList = '';
        fs.readFile('./data/data.json', 'utf-8', (err, data) => {
            if (err) {
                console.log(err.message)
            } else {
                itemList += data
                itemList = JSON.parse(itemList)
                newItem = qs.parse(newItem);
                let maxId = 0;
                for (let i of itemList) {
                    if (i.id > maxId) {
                        maxId = i.id;
                    }
                }
                newItem.id = maxId + 1;
                itemList.push(newItem);
                fs.writeFile('./data/data.json', JSON.stringify(itemList), err => {
                    if (err) {
                        console.log(err.message)
                    } else {
                        res.writeHead(301, { location: '/products' });
                        res.end()
                    }
                });
            }
        })
    })
}


handlers.showAddItemPage = (req, res) => {
    fs.readFile('./views/additem.html', 'utf-8', (err, data) => {
        if (err) {
            console.log(err.message);
        } else {
            res.end(data)
        }
    })
}

handlers.delete = (idDelete, req, res) => {
    let itemList = ''
    fs.readFile('./data/data.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err.message)
        } else {
            itemList = JSON.parse(data);
        }
        let index = -1
        for (let i in itemList) {
            if (itemList[i].id == idDelete) {
                index = i;
            }
        }
        if (index == -1) {
            res.writeHead(404, 'Not Found')
            res.end()
        } else {
            itemList.splice(index, 1)
            fs.writeFile('./data/data.json', JSON.stringify(itemList), err => {
                if (err) {
                    console.log(err.message)
                } else {
                    res.writeHead(301, { location: '/products' });
                    res.end()
                }
            })
        }
    })
}

handlers.showEditItemPage = (id, req, res) => {
    fs.readFile('./views/editItem.html', 'utf-8', (err, data) => {
        if (err) {
            console.log(err.message);
        } else {
            res.end(data)
        }
    })
}

handlers.edit = (idEdit, req, res) => {
    let itemList = '';
    let newItem = ''
    req.on('data', chunk => {
        newItem += chunk;
    })
    req.on('end', () => {
        fs.readFile('./data/data.json', (err, data) => {
            if (err) {
                console.log(err.message);
            } else {
                itemList = JSON.parse(data);
                let index = -1;
                for (let i in itemList) {
                    if (itemList[i].id == idEdit) {
                        index = i;
                    }
                }
                newItem = qs.parse(newItem);
                newItem.id = idEdit;
                itemList.splice(index, 1, newItem);
                fs.writeFile('./data/data.json', JSON.stringify(itemList), err => {
                    if (err) {
                        console.log(err.message)
                    } else {
                        res.writeHead(301, { location: '/products' });
                        res.end();
                    }
                })
            }
        })   
    })
    
}

module.exports = {
    handlers
}

