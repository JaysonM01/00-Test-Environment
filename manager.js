// //------------------------------SRP------------------------------//
// // This program has the following tasks in one class, which violates the SRP
// // 1. Manages user data
// // 2. Logs information
// // 3. Saves data to storage

// class UserManager {
//     constructor(user) {
//       this.user = user;
//     }
  
//     validateUser() {
//       return this.user.name && this.user.email;
//     }
  
//     saveUser() {
//       // Simulating save to DB
//       console.log(`Saving user: ${this.user.name}`);
//       localStorage.setItem('user', JSON.stringify(this.user));
//     }
  
//     logActivity(activity) {
//       console.log(`[${new Date().toISOString()}] ${activity}`);
//     }
//   }
  
//   const user = { name: "John Doe", email: "john@example.com" };
//   const manager = new UserManager(user);
  
//   if (manager.validateUser()) {
//     manager.saveUser();
//     manager.logActivity("User saved successfully.");
//   }
  
// // Refactored program complying with SRP
// // UserValidator - VValidates user input
// // UserRepository - Handles data storage
// // Logger - Handles logging
//   class UserValidator {
//     static isValid(user) {
//       return user.name && user.email;
//     }
//   }
  
//   class UserRepository {
//     static save(user) {
//       console.log(`Saving user: ${user.name}`);
//       localStorage.setItem('user', JSON.stringify(user));
//     }
//   }
  
//   class Logger {
//     static log(message) {
//       console.log(`[${new Date().toISOString()}] ${message}`);
//     }
//   }
  
//   // Usage
//   const user = { name: "John Doe", email: "john@example.com" };
  
//   if (UserValidator.isValid(user)) {
//     UserRepository.save(user);
//     Logger.log("User saved successfully.");
//   }

// // Points to Remember
// // 1. Maintainability - easier to update one part without breaking others
// // 2. Testability - each class can be tested in isolation
// // 3. Scalability - easy to replace localStorage with real database in UserRepository without touching validation or logging



// //------------------------------OCP------------------------------//
// // This program violates shows that the UserRepository violates the OCP
// // UserRepository supports multiple type of user storage
// // Adding new storage method will need to keep on modifying it

// class UserRepository {
//     static save(user, type = 'local') {
//       if (type === 'local') {
//         console.log(`Saving user to localStorage: ${user.name}`);
//         localStorage.setItem('user', JSON.stringify(user));
//       } else if (type === 'session') {
//         console.log(`Saving user to sessionStorage: ${user.name}`);
//         sessionStorage.setItem('user', JSON.stringify(user));
//       } else if (type === 'api') {
//         console.log(`Sending user to remote API: ${user.name}`);
//         // Simulated API call
//       } else {
//         throw new Error('Unknown storage type');
//       }
//     }
//   }

// // Using abstraction to allow extension without modifying existing code
// // 1. Create a Storage Interface
// class IUserStorage {
//     save(user) {
//       throw new Error('Method not implemented.');
//     }
//   }

// // 2. Implement Specific Storage Strategies
// class LocalStorageRepository extends IUserStorage {
//     save(user) {
//       console.log(`Saving user to localStorage: ${user.name}`);
//       localStorage.setItem('user', JSON.stringify(user));
//     }
//   }
  
//   class SessionStorageRepository extends IUserStorage {
//     save(user) {
//       console.log(`Saving user to sessionStorage: ${user.name}`);
//       sessionStorage.setItem('user', JSON.stringify(user));
//     }
//   }
  
//   class ApiStorageRepository extends IUserStorage {
//     save(user) {
//       console.log(`Simulated API call to save user: ${user.name}`);
//       // Simulated fetch: fetch('/api/saveUser', {...})
//     }
//   }

// // 3. Use Polymorphism in Client Code
// class UserService {
//     constructor(storage) {
//       this.storage = storage;
//     }
  
//     save(user) {
//       this.storage.save(user);
//     }
//   }

// // Final Usage
// const user = { name: "John Doe", email: "john@example.com" };

// if (UserValidator.isValid(user)) {
//   const storage = new ApiStorageRepository(); // Or LocalStorageRepository, etc.
//   const userService = new UserService(storage);
//   userService.save(user);
//   Logger.log("User saved successfully.");
// }


// //------------------------------LSP------------------------------//
// // Using the same class IUserStorage, we have a subclass FaultyStorageRepository which doesn't fully comply with the contract of the save( ) method
// class IUserStorage {
//     save(user) {
//       throw new Error("Method not implemented.");
//     }
//   }
  
//   class LocalStorageRepository extends IUserStorage {
//     save(user) {
//       console.log(`Saving user to localStorage: ${user.name}`);
//       localStorage.setItem('user', JSON.stringify(user));
//     }
//   }
  
//   class SessionStorageRepository extends IUserStorage {
//     save(user) {
//       console.log(`Saving user to sessionStorage: ${user.name}`);
//       sessionStorage.setItem('user', JSON.stringify(user));
//     }
//   }
  
//   class FaultyStorageRepository extends IUserStorage {
//     save(user) {
//       console.log(`Attempting to save user in faulty storage: ${user.name}`);
//       throw new Error("Storage error occurred!"); // Error is thrown unexpectedly
//     }
//   }
  
//   // UserService remains unchanged
//   class UserService {
//     constructor(storage) {
//       this.storage = storage;
//     }
  
//     save(user) {
//       this.storage.save(user);
//     }
//   }
  
//   // Usage
//   const user = { name: "John Doe", email: "john@example.com" };
  
//   const userService1 = new UserService(new LocalStorageRepository());
//   userService1.save(user); // Works fine
  
//   const userService2 = new UserService(new FaultyStorageRepository());
//   userService2.save(user); // Violates LSP because it unexpectedly throws an error

// // The UserService class expects that any IUserStorage object can be used interchangeably without unexpected side effects
// // FaultyStorageRepository breaks the codeby throwing error which violates LSP
// // Client UserService cannot be substitute FaultyStorageRepository without causing an issue
// // Apply LSP
// // 1. Refactor the FaultyStorageRepository to not throw errors
// class FaultyStorageRepository extends IUserStorage {
//     save(user) {
//       console.log(`Attempting to save user in faulty storage: ${user.name}`);
//       // Instead of throwing an error, we handle the failure gracefully
//       return false;  // Indicating that saving the user failed without throwing an error
//     }
//   }
// // 2. Ensure Consistent Behavior for All Subclasses
// class IUserStorage {
//     save(user) {
//       throw new Error("Method not implemented.");
//     }
//   }
  
//   class LocalStorageRepository extends IUserStorage {
//     save(user) {
//       console.log(`Saving user to localStorage: ${user.name}`);
//       localStorage.setItem('user', JSON.stringify(user));
//     }
//   }
  
//   class SessionStorageRepository extends IUserStorage {
//     save(user) {
//       console.log(`Saving user to sessionStorage: ${user.name}`);
//       sessionStorage.setItem('user', JSON.stringify(user));
//     }
//   }
  
//   class FaultyStorageRepository extends IUserStorage {
//     save(user) {
//       console.log(`Attempting to save user in faulty storage: ${user.name}`);
//       // Instead of throwing an error, we return false indicating failure
//       return false;  // Gracefully handle the failure
//     }
//   }
  
//   class UserService {
//     constructor(storage) {
//       this.storage = storage;
//     }
  
//     save(user) {
//       const result = this.storage.save(user);
//       if (!result) {
//         console.log("User storage failed, please try again.");
//       } else {
//         console.log("User saved successfully.");
//       }
//     }
//   }
  
//   // Usage
//   const user = { name: "John Doe", email: "john@example.com" };
  
//   const userService1 = new UserService(new LocalStorageRepository());
//   userService1.save(user); // Works fine
  
//   const userService2 = new UserService(new FaultyStorageRepository());
//   userService2.save(user); // Gracefully handles failure, no exception thrown

// //------------------------------ISP------------------------------//
// // In IUserStorage, update() and delete() will be added but some repository won't need the method
// class IUserStorage {
//     save(user) { throw new Error("Method not implemented."); }
//     update(user) { throw new Error("Method not implemented."); }
//     delete(user) { throw new Error("Method not implemented."); }
//   }
  
//   class LocalStorageRepository extends IUserStorage {
//     save(user) { console.log(`Saving user to localStorage: ${user.name}`); }
//     update(user) { console.log(`Updating user in localStorage: ${user.name}`); }
//     delete(user) { console.log(`Deleting user from localStorage: ${user.name}`); }
//   }
  
//   class ApiStorageRepository extends IUserStorage {
//     save(user) { console.log(`Sending user to API: ${user.name}`); }
//     update(user) { throw new Error("API doesn't support update"); } // Violation: We shouldn't force this
//     delete(user) { throw new Error("API doesn't support delete"); } // Violation: We shouldn't force this
//   }
  
//   // Client code
//   const apiStorage = new ApiStorageRepository();
//   apiStorage.update(user);  // Violates ISP, as ApiStorageRepository doesn't support 'update'

// // Refactor code applying ISP
// // Split IUserStorage into smaller interfaces
// class IUserStorage {
//     save(user) { throw new Error("Method not implemented."); }
//   }
  
//   class IUserUpdate {
//     update(user) { throw new Error("Method not implemented."); }
//   }
  
//   class IUserDelete {
//     delete(user) { throw new Error("Method not implemented."); }
//   }
  
//   class LocalStorageRepository extends IUserStorage implements IUserUpdate, IUserDelete {
//     save(user) { console.log(`Saving user to localStorage: ${user.name}`); }
//     update(user) { console.log(`Updating user in localStorage: ${user.name}`); }
//     delete(user) { console.log(`Deleting user from localStorage: ${user.name}`); }
//   }
  
//   class ApiStorageRepository extends IUserStorage {
//     save(user) { console.log(`Sending user to API: ${user.name}`); }
//   }
  
//   // Client code
//   const apiStorage = new ApiStorageRepository();
//   apiStorage.save(user);  // Works fine
  
//   // LocalStorageRepository can be used with all methods
//   const localStorage = new LocalStorageRepository();
//   localStorage.update(user);  // Works fine

// // 1. IUserStorage was was split into smaller, more specific interfaces
// // 2. ApiStorageRepository only implements IUserStorage, not IUserUpdate or IUserDelete so it does not need to implement methods

// // Points to Remember
// // 1. Each class implements only the methods it needs
// // 2. No class is forced to implement methods that it doesn't use

// //------------------------------DIP------------------------------//
// // The UserService directly depends on concrete implementation of IUserStorage
// // UserService is tightly coupled to low-level storage classes, violating DIP

// class UserService {
//     constructor() {
//       // Direct dependency on low-level module
//       this.storage = new LocalStorageRepository();  // Concrete dependency, violates DIP
//     }
  
//     save(user) {
//       this.storage.save(user);
//     }
//   }
  
//   class LocalStorageRepository {
//     save(user) {
//       console.log(`Saving user to localStorage: ${user.name}`);
//       localStorage.setItem('user', JSON.stringify(user));
//     }
//   }
  
//   // Client code
//   const userService = new UserService();  // Directly depends on LocalStorageRepository
//   userService.save(user);
  
//   //Applying DIP
//   // Abstraction
// class IUserStorage {
//     save(user) {
//       throw new Error("Method not implemented.");
//     }
//   }
  
//   // Concrete Storage Implementations
//   class LocalStorageRepository extends IUserStorage {
//     save(user) {
//       console.log(`Saving user to localStorage: ${user.name}`);
//       localStorage.setItem('user', JSON.stringify(user));
//     }
//   }
  
//   class ApiStorageRepository extends IUserStorage {
//     save(user) {
//       console.log(`Sending user to API: ${user.name}`);
//       // Simulated API call
//     }
//   }
  
//   // High-level module depending on abstraction
//   class UserService {
//     constructor(storage) {
//       this.storage = storage;  // Injected dependency, no direct instantiation
//     }
  
//     save(user) {
//       this.storage.save(user);
//     }
//   }
  
//   // Client code
//   const apiStorage = new ApiStorageRepository();
//   const userService = new UserService(apiStorage);  // Dependency injected
//   userService.save(user);
  
//   const localStorage = new LocalStorageRepository();
//   const userService2 = new UserService(localStorage);  // Can easily swap implementation
//   userService2.save(user);

// // Points to Remember
// // 1. Decouple from concrete storage implementations
// // 2. Can easily change the type without changing the class
// // 3. High-level module no longer depends on low-level modules, and both depends on the abstraction