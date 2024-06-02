import {Level} from 'level';

class ServiceRepository {

  constructor(dbFile) {
    this.db = new Level(dbFile, { valueEncoding: 'json' });
  }

  async fetchAll() {
      return this.db.iterator().all();
  }

  async get(key) {
    return await this.db.get(key);
  }

  async put(key, value) {
    return await this.db.put(key, value);
  }

  async del(key) {
    return await this.db.del(key);
  }

}

export default ServiceRepository;