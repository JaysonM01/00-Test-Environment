// public class Account
// {
//     private final InterestCalculator interestCalculator;
//     protected double balance;

//     public Account(InterestCalculator interestCalculator)
//     {
//         this.interestCalculator = interestCalculator;
//     }
//     protected boolean creditAmount(double amount) throws InsufficientBalanceException
//     {
//         this.balance += amount;
//         return true;
//     }
//     protected boolean debitAmount(double amount) throws InsufficientBalanceException
//     {
//         if(this.balance >= amount)
//         {
//             balance -= amount;
//             return true;
//         }
//         throw new InsufficientBalanceException("Insufficient funds in account to debit");
//     }
// }
// class SavingsAccount extends Account
// {
//     public SavingsAccount(InterestCalculator interestCalculator)
//     {
//         super(interestCalculator);
//     }
// }