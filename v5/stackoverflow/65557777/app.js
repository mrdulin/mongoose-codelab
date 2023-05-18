const { MongoConnect } = require('../../src/db');
const User = require('./user');

function main() {
  MongoConnect(async () => {
    // seed
    await User.create([{ name: '1', password: '123', widgets: [{ city: 'us' }, { city: 'japan' }] }]);

    const user = await User.findOne({ name: '1' });
    user.widgets.push({ city: 'viking' });
    await user.save();
  });
}

main();
