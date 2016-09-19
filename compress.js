function compress(str) {
  if (!str.length) {
    return '';
  }
  var i = 1;
  var result = [str[0], 1];
  while (i < str.length) {
    if (str[i] === str[i - 1]) {
      result[result.length - 1] ++;
    } else {
      result.push(str[i]);
      result.push(1);
    }
    i ++;
  }
  return result.join('');
}

module.exports = compress;
