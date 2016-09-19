/**
 *  scheme:[//[user:password@]host[:port]][/]path[?query][#fragment]
 *
 *                      hierarchical part
 *        ┌───────────────────┴─────────────────────┐
 *                       base                 path
 *        ┌───────────────┴───────────────┐┌───┴────┐
 *  abc://username:password@example.com:123/path/data?key=value&key2=value2#fragid1
 *  └┬┘   └───────┬───────┘ └────┬────┘ └┬┘           └─────────┬─────────┘ └──┬──┘
 * scheme  user information     host     port                  query         fragment
 *
 */

function hex2ascii(s) {
  var result = [];
  var i = 0;
  while (i < s.length) {
    if (s[i] === '%' && i + 2 < s.length) {
      var ord = parseInt(s[i + 1] + s[i + 2], 16);
      if (ord) {
        result.push(String.fromCharCode(ord));
        i += 3;
      } else {
        result.push(s[i]);
        i ++;
      }
    } else {
      result.push(s[i]);
      i ++;
    }
  }
  return result.join('');
}

function parse(uri) {
  var parts = uri.split('://');
  var scheme = parts[0].toLowerCase();
  var remaining = parts[1];

  // base: auth, hostname, port
  var base = remaining.split('/')[0];
  var username;
  var password;
  var hostname;
  var port;
    // auth
  if (base.indexOf('@') > -1) {
    creds = base.split('@')[0];
    username = creds.substr(0, creds.indexOf(':'));
    password = creds.substr(creds.indexOf(':') + 1);
    base = base.substr(base.indexOf('@') + 1);
  }
    // port
  if (base.indexOf(':') > -1) {
    var hostnameParts = base.split(':');
    var delimIndex = base.indexOf(':');
    port = base.substr(delimIndex + 1);
    base = base.substr(0, base.indexOf(':'));
    if (port == '80') {
      port = undefined;
    }
  }
    // hostname
  hostname = hex2ascii(base.toLowerCase());

  // path, query, fragment
  var body = remaining.substr(remaining.indexOf('/') + 1);
  var pathString;
  var queryString;
  var query;
  var fragment;
  var path;

  if (body) {
    var queryBegin = body.indexOf('?');
    var fragmentBegin = body.indexOf('#');

    if (queryBegin > -1 && fragmentBegin > -1 && queryBegin < fragmentBegin) {
      pathString = body.substr(0, queryBegin);
      queryString = body.substr(queryBegin + 1, fragmentBegin);
      fragment = body.substr(fragmentBegin + 1);
    } else if (fragmentBegin > -1) {
      pathString = body.substr(0, fragmentBegin);
      fragment = body.substr(fragmentBegin + 1);
    } else if (queryBegin > -1) {
      pathString = body.substr(0, queryBegin);
      queryString = body.substr(queryBegin + 1);
    } else {
      pathString = body;
    }

    if (pathString) {
      var nodes = pathString.split('/').map(function(node) {
        return hex2ascii(node);
      });
      var normalizedNodes = [];
      var i = 0;
      nodes.forEach(function(node) {
        if (node == '.') {
          return;
        } else if (node == '..') {
          normalizedNodes.pop();
        } else {
          normalizedNodes.push(node);
        }
      });
      path = normalizedNodes.join('/');
    }

    if (queryString) {
      var pairs = queryString.split('&');
      var params = {};
      pairs.forEach(function(pair) {
        var key = pair.split('=')[0];
        var value = pair.split('=')[1];
        key = hex2ascii(key);
        value = hex2ascii(value);
        if (!params[key]) {
          params[key] = [key + '=' + value];
        } else {
          params[key].push(key + '=' + value);
        }
      });
      query = [];
      for (var key in params) {
        params[key] = params[key].join('&');
        query.push(params[key]);
      }
      query = query.sort().join('&');
    }

    if (fragment) {
      fragment = hex2ascii(fragment);
    }
  }

  var components = {
    scheme: scheme,
    username: username,
    password: password,
    hostname: hostname,
    port: port,
    path: path,
    query: query,
    fragment: fragment
  };
  return components;
}

function checkURIs(uri1, uri2) {
  return JSON.stringify(parse(uri1)) == JSON.stringify(parse(uri2));
}

module.exports = checkURIs;
