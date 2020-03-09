const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const math = require('testmathblabla');
const app = http.createServer();
const port = 8001;

app.on('request', (req, res) => {

    switch (req.method) {
        case 'GET':
            fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
                err ? console.log(err) : res.end(data);
            });
            break;

        case 'POST':
            switch (url.parse(req.url).pathname) {
                case '/min':
                    req.on('data', (data) => {
                        const _data = data.toString().split(',');
                        res.writeHead(200).end(math.min(_data).toString());
                    });
                    break;

                case '/directory':
                    const allFilePaths = getFilesRecursively(__dirname);
                    const allFileNames = [];
                    allFilePaths.forEach((i) => allFileNames.push(path.basename(i)));
                    res.writeHead(200).end(JSON.stringify(allFileNames));
                    break;
            }
            break;
    }
});

const isDirectory = _path => fs.statSync(_path).isDirectory();
const getDirectories = _path => fs.readdirSync(_path).map(name => path.join(_path, name)).filter(isDirectory);

const isFile = _path => fs.statSync(_path).isFile();
const getFiles = _path => fs.readdirSync(_path).map(name => path.join(_path, name)).filter(isFile);

const getFilesRecursively = (_path) => {
    let dirs = getDirectories(_path);
    let files = dirs
        .map(dir => getFilesRecursively(dir))
        .reduce((a,b) => a.concat(b), []);
    return files.concat(getFiles(_path));
};

app.listen(port, () => console.log('Started up on port: ', port));
