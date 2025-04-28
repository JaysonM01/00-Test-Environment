//Interfaces
class ISave {
  save(user) {
    throw new Error('save() not implemented.');
  }
}

class IUpdate {
  update(user) {
    throw new Error('update() not implemented.');
  }
}

class IDelete {
  delete(userId) {
    throw new Error('delete() not implemented.');
  }
}

class ISync {
  syncWithServer() {
    throw new Error('syncWithServer() not implemented.');
  }
}
//Implementation
class LocalStorageRepository extends ISave {
  save(user) {
    localStorage.setItem('user', JSON.stringify(user));
    console.log('Saved to localStorage');
  }
}
class ApiRepository extends ISave {
  save(user) {
    console.log('Sending user to API...');
    // simulate fetch()
  }
}
class SyncingApiRepository extends ISave {
  save(user) {
    console.log('Saving via sync-enabled API');
  }

  syncWithServer() {
    console.log('Sync complete.');
  }
}
