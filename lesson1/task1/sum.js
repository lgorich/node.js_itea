module.exports = (...values) => {
    console.log('sum: ', values.reduce((a, b) => a + b, 0));
};
