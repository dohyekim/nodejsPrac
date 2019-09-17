a=[3,1,2]; a.sort(); console.log(a);
// [ 1, 2, 3 ]
a=[3,1,2]; a.reverse(); console.log(a);
// [ 2, 1, 3 ]
a=[3,1,2]; a.sort((a,b) => a > b); console.log(a);
// [ 1, 2, 3 ]
a=[3,1,2]; a.sort((a,b) => a < b); console.log(a);
//  [ 3, 2, 1 ]


a = [3,1,2]; function b(v1, v2){console.log('---> ',v1,v2); return 0}; a.sort(b); console.log(a);
// --->  3 1
// --->  1 2
// [ 3, 1, 2 ]


// 이런 식으로 작동하는 셈입니다.
function sort(callback) {callback()};
sort(function() {
    console.log('Hello Callback!');
});
// Hello Callback!