import Log from './Log';

class LogController {
  static async create(content) {
    await Log.create({ content });
  }
}

export default LogController;
