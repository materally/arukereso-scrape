function urlHasParam(url) {
  url += url.indexOf("?") > -1 ? "&" : "?";
  return url;
}

module.exports = {
  urlHasParam,
};
