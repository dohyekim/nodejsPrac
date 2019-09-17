function hello(name) {
    console.log('Hi' + name) // `Hi ${name}`: UglifyJS can't minify ES6 feature
}

hello('World')