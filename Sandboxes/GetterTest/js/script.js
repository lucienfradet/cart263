/**
Getter Testing

Proof that using a getter is different from anonymous function because it can't be overwritten
Also, It can be used to re-asign the value once it's been calculated so it doesn't need to be processed again by the computer
Just make sure to delete the get element beforehand

meaning you can call the method as a property even when there's a function in it!
as opposed to having to call `object.getTheThing()` and then... `object.getTheThing`
*/


"use strict";

let object = {
  a: "hello",
  get getTheThing() {
    //setTimeout(() => {
      for (let i = 0; i < 5000000000; i++) {
        let a = 1;
      }
      delete this.getTheThing;
      return this.getTheThing = this.a
    //}, 5000);
  }
}
console.log(object.a);
//object.getTheThing = 8;
console.log(object.getTheThing;

//setTimeout(() => {
  console.log(object.getTheThing);
//}, 6000);
