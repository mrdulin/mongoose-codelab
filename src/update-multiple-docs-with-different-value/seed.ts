import * as casual from 'casual';

function seed() {
  const name = casual.username;
  const age = 0;
  const count = 10;
  const datas: any[] = [];

  for (let i = 0; i < count; i++) {
    const data = { name, age };
    datas.push(data);
  }

  return datas;
}

export { seed };
