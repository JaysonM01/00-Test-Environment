//------------------------------SRP------------------------------//
// This program has the following tasks in one class, which violates the SRP
// 1. Manages user data
// 2. Logs information
// 3. Saves data to storage

class UserManager {
    constructor(user) {
      this.user = user;
    }
  
    validateUser() {
      return this.user.name && this.user.email;
    }
  
    saveUser() {
      // Simulating save to DB
      console.log(`Saving user: ${this.user.name}`);
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  
    logActivity(activity) {
      console.log(`[${new Date().toISOString()}] ${activity}`);
    }
  }
  
  const user = { name: "John Doe", email: "john@example.com" };
  const manager = new UserManager(user);
  
  if (manager.validateUser()) {
    manager.saveUser();
    manager.logActivity("User saved successfully.");
  }
  
// Refactored program complying with SRP
// UserValidator - VValidates user input
// UserRepository - Handles data storage
// Logger - Handles logging
  class UserValidator {
    static isValid(user) {
      return user.name && user.email;
    }
  }
  
  class UserRepository {
    static save(user) {
      console.log(`Saving user: ${user.name}`);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  
  class Logger {
    static log(message) {
      console.log(`[${new Date().toISOString()}] ${message}`);
    }
  }
  
  // Usage
  const user = { name: "John Doe", email: "john@example.com" };
  
  if (UserValidator.isValid(user)) {
    UserRepository.save(user);
    Logger.log("User saved successfully.");
  }

// Points to Remember
// 1. Maintainability - easier to update one part without breaking others
// 2. Testability - each class can be tested in isolation
// 3. Scalability - easy to replace localStorage with real database in UserRepository without touching validation or logging



//------------------------------OCP------------------------------//
// This program violates shows that the UserRepository violates the OCP
// UserRepository supports multiple type of user storage
// Adding new storage method will need to keep on modifying it

class UserRepository {
    static save(user, type = 'local') {
      if (type === 'local') {
        console.log(`Saving user to localStorage: ${user.name}`);
        localStorage.setItem('user', JSON.stringify(user));
      } else if (type === 'session') {
        console.log(`Saving user to sessionStorage: ${user.name}`);
        sessionStorage.setItem('user', JSON.stringify(user));
      } else if (type === 'api') {
        console.log(`Sending user to remote API: ${user.name}`);
        // Simulated API call
      } else {
        throw new Error('Unknown storage type');
      }
    }
  }

// Using abstraction to allow extension without modifying existing code
// 1. Create a Storage Interface
class IUserStorage {
    save(user) {
      throw new Error('Method not implemented.');
    }
  }

// 2. Implement Specific Storage Strategies
class LocalStorageRepository extends IUserStorage {
    save(user) {
      console.log(`Saving user to localStorage: ${user.name}`);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  
  class SessionStorageRepository extends IUserStorage {
    save(user) {
      console.log(`Saving user to sessionStorage: ${user.name}`);
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }
  
  class ApiStorageRepository extends IUserStorage {
    save(user) {
      console.log(`Simulated API call to save user: ${user.name}`);
      // Simulated fetch: fetch('/api/saveUser', {...})
    }
  }

// 3. Use Polymorphism in Client Code
class UserService {
    constructor(storage) {
      this.storage = storage;
    }
  
    save(user) {
      this.storage.save(user);
    }
  }

// Final Usage
const user = { name: "John Doe", email: "john@example.com" };

if (UserValidator.isValid(user)) {
  const storage = new ApiStorageRepository(); // Or LocalStorageRepository, etc.
  const userService = new UserService(storage);
  userService.save(user);
  Logger.log("User saved successfully.");
}


//------------------------------LSP------------------------------//
// Using the same class IUserStorage, we have a subclass FaultyStorageRepository which doesn't fully comply with the contract of the save( ) method
class IUserStorage {
    save(user) {
      throw new Error("Method not implemented.");
    }
  }
  
  class LocalStorageRepository extends IUserStorage {
    save(user) {
      console.log(`Saving user to localStorage: ${user.name}`);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  
  class SessionStorageRepository extends IUserStorage {
    save(user) {
      console.log(`Saving user to sessionStorage: ${user.name}`);
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }
  
  class FaultyStorageRepository extends IUserStorage {
    save(user) {
      console.log(`Attempting to save user in faulty storage: ${user.name}`);
      throw new Error("Storage error occurred!"); // Error is thrown unexpectedly
    }
  }
  
  // UserService remains unchanged
  class UserService {
    constructor(storage) {
      this.storage = storage;
    }
  
    save(user) {
      this.storage.save(user);
    }
  }
  
  // Usage
  const user = { name: "John Doe", email: "john@example.com" };
  
  const userService1 = new UserService(new LocalStorageRepository());
  userService1.save(user); // Works fine
  
  const userService2 = new UserService(new FaultyStorageRepository());
  userService2.save(user); // Violates LSP because it unexpectedly throws an error

// The UserService class expects that any IUserStorage object can be used interchangeably without unexpected side effects
// FaultyStorageRepository breaks the codeby throwing error which violates LSP
// Client UserService cannot be substitute FaultyStorageRepository without causing an issue
// Apply LSP
// 1. Refactor the FaultyStorageRepository to not throw errors
class FaultyStorageRepository extends IUserStorage {
    save(user) {
      console.log(`Attempting to save user in faulty storage: ${user.name}`);
      // Instead of throwing an error, we handle the failure gracefully
      return false;  // Indicating that saving the user failed without throwing an error
    }
  }
// 2. Ensure Consistent Behavior for All Subclasses
class IUserStorage {
    save(user) {
      throw new Error("Method not implemented.");
    }
  }
  
  class LocalStorageRepository extends IUserStorage {
    save(user) {
      console.log(`Saving user to localStorage: ${user.name}`);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  
  class SessionStorageRepository extends IUserStorage {
    save(user) {
      console.log(`Saving user to sessionStorage: ${user.name}`);
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }
  
  class FaultyStorageRepository extends IUserStorage {
    save(user) {
      console.log(`Attempting to save user in faulty storage: ${user.name}`);
      // Instead of throwing an error, we return false indicating failure
      return false;  // Gracefully handle the failure
    }
  }
  
  class UserService {
    constructor(storage) {
      this.storage = storage;
    }
  
    save(user) {
      const result = this.storage.save(user);
      if (!result) {
        console.log("User storage failed, please try again.");
      } else {
        console.log("User saved successfully.");
      }
    }
  }
  
  // Usage
  const user = { name: "John Doe", email: "john@example.com" };
  
  const userService1 = new UserService(new LocalStorageRepository());
  userService1.save(user); // Works fine
  
  const userService2 = new UserService(new FaultyStorageRepository());
  userService2.save(user); // Gracefully handles failure, no exception thrown

// 