const metaDatas = [
  { item: 'abc', price: 10, quantity: 2, date: new Date('2014-03-01T08:00:00Z') },
  { item: 'jkl', price: 20, quantity: 1, date: new Date('2014-03-01T09:00:00Z') },
  { item: 'xyz', price: 5, quantity: 10, date: new Date('2014-03-15T09:00:00Z') },
  { item: 'xyz', price: 5, quantity: 20, date: new Date('2014-04-04T11:21:39.736Z') },
  { item: 'abc', price: 10, quantity: 10, date: new Date('2014-04-04T21:23:13.331Z') }
];

function generateData(metas: any[] = metaDatas) {
  return metas;
}

export { generateData, metaDatas };
