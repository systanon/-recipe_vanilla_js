const fs = require('fs');
const faker = require('faker');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
const { TAGS } = require('./tags');

const generateData = async (x) => {
  try {
    const json = JSON.stringify({ data: arrayFiller(x)([]) });

    await fs.writeFile('db.json', json, 'utf8', () => {
      console.log('Items are generated:', x);
    });
  } catch (e) {
    console.log(new Error(e));
  }
};

const arrayFiller = (count) => (array) => {
  const ingredients = new Array(faker.random.number({ min: 1, max: 4 })).fill(null).map((_ingredient, index) => ({
    id: index,
    image: `${faker.image.food()}/${index}`,
    name: faker.lorem.words(1),
    amount: faker.random.number({ min: 1, max: 5 }),
  }));

  const tags = TAGS.sort(() => 0.5 - Math.random()).slice(0, faker.random.number({ min: 0, max: 10 }));

  const data = {
    id: array.length,
    image: faker.image.food() + `/${array.length}`,
    name: faker.lorem.words(2),
    description: faker.lorem.sentence(),
    ingredients,
    tags,
  };

  array.push(data);

  return count >= array.length ? arrayFiller(count)(array) : array;
};

const main = () => {
  readline.question('How much data items do you need? Number: ', async (answer) => {
    await generateData(Number(answer));

    readline.close();
  });
};

main();
