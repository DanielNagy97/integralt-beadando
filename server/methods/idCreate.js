var index = -1;

module.exports = function idCreate() {
    index++;
    return String(index);
}