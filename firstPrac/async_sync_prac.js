let fs = require ('fs');

// Synchronous
console.log("This happens first");
// option 자리에는 객체를 넣는다 (API 참고)
let syncData = fs.readFileSync('prac_data.txt', {encoding: 'utf-8'});
console.log(syncData);
console.log("This happens last");

// Asynchronous
console.log("This is for Async(2222)")
// arguments of callback function are specified in the API docs
fs.readFile('prac_data.txt', {encoding:'utf-8'}, (err, data) => {
    console.log("33333")
    console.log(`data >> ${data} \n err >> ${err}`)
    if (err) {
        console.log(`Error Thrown!! >> ${err}`)
    }
})
console.log("When will it happen? 4444???")