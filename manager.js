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
  
  // The program above should be refactored, applying the SRP

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
  