const fs = require('fs');
const superagent = require('superagent');

const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if(err) {
                reject('Cannot find file');
            }
            resolve(data);
        });
    });
}

const writeFilePro = (file, data) =>  {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, err => {
            if (err) {
                reject('error write');
            }
            resolve('success writefilepro');
        })
    })
}
readFilePro(`${__dirname}/dog.txt`)
    .then(res => {
        console.log(`Breed: ${res}`);
        return superagent.get(`https://dog.ceo/api/breed/${res}/images/random`);
    })
    .then(res => {
        console.log(res.body.message);
        return writeFilePro('dog-img.txt', res.body.message);
    })
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(`Error3: ${err}`);
    })

