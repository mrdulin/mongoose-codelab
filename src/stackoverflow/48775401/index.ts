export class FooClass {
  getData() {
    console.log('getData');
    this.getDataFromDb();
    this.barMethod();
  }
  getDataFromDb() {
    console.log('getDataFromDb');
  }
  barMethod() {
    console.log('barMethod');
  }
}
