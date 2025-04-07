// //this is a single-line comment
// /*
// this is a
// multi-line
// comment
// */
// // create your classes here
// class Computer {
//     useIt() {
//         console.log("*click* *click*");
//     }
// }
// class PlayGames extends Computer {
//     useIt(type) {
//         super.useIt();
//         switch (type) {
//             case "FPS":
//                 console.log("*Bang* *Bang*, *Pew* *Pew*");
//             case "Bomb":
//                 console.log("*Boom!*");
//             default:
//                 break;
//         }
//     }
// }
// class SurfNet extends Computer {
//     useIt() {
//         super.useIt();
//         console.log("*Clack* *Clack*");
//     }
// }
// class BrowseFiles extends Computer {
//     useIt() {
//         super.useIt();
//     }
// }
// var Minesweeper = new PlayGames();
// var CS = new PlayGames();
// var Google = new SurfNet();
// var Documents = new BrowseFiles();
// Minesweeper.useIt("Bomb");
// CS.useIt("FPS");
// Google.useIt();
// Documents.useIt();