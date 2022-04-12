const {readdirSync, readFileSync, writeFileSync} = require('fs');

const HIDDEN = ['.git', 'node_modules'];

const entries = readdirSync('.',{withFileTypes:true})
    .map(file => {
        if(file.isDirectory() && !HIDDEN.includes(file.name)){
            return file.name;
        }
    })
    .filter(Boolean);

const TEMPLATE = readFileSync('index.template.html').toString();

writeFileSync('index.html', TEMPLATE.replace('__CONTENT__', entries.map(e=>`<li><a href="${e}/">${e}</a></li>`).join('')));