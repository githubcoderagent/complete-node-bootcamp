const fs = require('fs');
const superagent = require('superagent');

const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if(err) {
                reject('Cannot find file');
            }
            console.log('success read');
            resolve(data);
        });
    });
}

const writeFilePro = (file, data) =>  {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, err => {
            if (err) {
                reject('bad write');
            }
            resolve('success writefilepro');
        })
    })
}

const getDogPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed: ${data}`);

        //const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        //console.log(res.body.message);
        //const ans = await writeFilePro('dog-img.txt', res.body.message);
        const getBreed = `https://dog.ceo/api/breed/${data}/images/random`;
        //console.log(getBreed);
        const getDog = ((getBreed) => { return superagent.get(getBreed); });
        
        const pdog = await Promise.all([getDog(getBreed),getDog(getBreed),getDog(getBreed)]);
        const imgs = pdog.map(el => el.body.message);
        console.log(imgs);
        await writeFilePro('dog-img.txt', imgs.join('\n'));
        //const ans = await writeFilePro('dog-img.txt', res.body.message);
        //console.log(ans);    
    }
    catch (err) {
        console.log(err);
    }
    return 'done';
}
(async () => {
    console.log('here 1');
    try {
        const x = await getDogPic();
        console.log(x);
    }
    catch (err) {
        console.log(`getdogpic err: ${err}`);
    }
    finally {
        console.log('completely done');
    }
})();

/* getDogPic()
    .then(x => {
        console.log(x);
    })
    .catch(err => {
        console.log(`getdogpic err: ${err}`);
    })
    .finally (() => {
        console.log('completely done');
    });
 */