var Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

Alphabet = Alphabet.split("");

var Crypto = function (alpha, C) {
  var p, B, k, encrypt, decrypt, f, g, modInv, modPow, toAlpha, to10, generatePrime, isPrime, gen, message;
  clearButton = function () {
    console.log("test")
  },
  toAlpha = function (x) {
    var y, p, l, n;
    if (x === 0) {
      return "!!!!";
    }
    y = [];
    n = 4;
    n = Math.ceil(n);
    while (n--) {
      p = Math.pow(alpha.length, n);
      l = Math.floor(x / p);
      y.push(alpha[l]);
      x -= l * p;
    }
    y = y.join("");
    return y;
  };
  to10 = function (x) {
    var y, p, n;
    y = 0;
    p = 1;
    x = x.split("");
    n = x.length;
    while (n--) {
      y += alpha.indexOf(x[n]) * p;
      p *= alpha.length;
    }
    return y;
  };
  modInv = function (gen, mod) {
    var v, d, u, t, c, q;
    v = 1;
    d = gen;
    t = 1;
    c = mod % gen;
    u = Math.floor(mod / gen);
    while (d > 1) {
      q = Math.floor(d / c);
      d = d % c;
      v = v + q * u;
      if (d) {
        q = Math.floor(c / d);
        c = c % d;
        u = u + q * v;
      }
    }
    return d ? v : mod - u;
  };
  modPow = function (base, exp, mod) {
    var c, x;
    if (exp === 0) {
      return 1;
    } else if (exp < 0) {
      exp = -exp;
      base = modInv(base, mod);
    }
    c = 1;
    while (exp > 0) {
      if (exp % 2 === 0) {
        base = (base * base) % mod;
        exp /= 2;
      } else {
        c = (c * base) % mod;
        exp--;
      }
    }
    return c;
  };
  isPrime = function isPrime(num) {
    for (var i = 2; i < num; i++) {
      if (num % i === 0) {
        return false;
      }
    }
    return true;
  };
  generatePrime = function () {
    var p = 0;
    do {
      p = Math.floor(Math.random() * (3000 - 1000) + 1000);
      console.log({ p })
    } while (!isPrime(p));

    console.log({ p })
    return p;
  };
  message = document.getElementById("txtBanRo").value;
  p = generatePrime(); // so nguyen to
  gen = Math.floor(Math.random() * ((p - 2) - 2) + 2)
  C = parseInt(C, 10); // ep kieu ve kieu int
  if (isNaN(C)) {
    C = Math.round(Math.sqrt(Math.random() * Math.random()) * (p - 2) + 2); // random C
  }
  B = modPow(gen, C, p); // tinh a^x mod p
  k = Math.floor(Math.random() * (p - 2) + 2); // so ngau nhien k
  decrypt = function (a) {
    var d, x, y;
    x = a[1];
    y = modPow(a[0], -C, p);
    d = (x * y) % p;
    d = Math.round(d) % p;
    return alpha[d - 2];
  };
  encrypt = function (key, d, k) {
    var a;
    
    d = alpha.indexOf(d) + 2;
    a = [];
    a[0] = modPow(key[1], k, key[0]);
    a[1] = (d * modPow(key[2], k, key[0])) % key[0];
    return a;
  };
  f = function (message, key) {
    var n, x, y, w;
    y = [];
    message = message.split("");
    n = message.length;
    while (n--) {
      x = encrypt(key, message[n], k);
      y.push(toAlpha(x[0]));
      y.push(toAlpha(x[1]));
    }
    y = y.join("");
    return y;
  };
  g = function (message) {
    var n, m, d, x;
    m = [];
    n = message.length / 8;
    while (n--) {
      x = message[8 * n + 4];
      x += message[8 * n + 5];
      x += message[8 * n + 6];
      x += message[8 * n + 7];
      m.unshift(x);
      x = message[8 * n];
      x += message[8 * n + 1];
      x += message[8 * n + 2];
      x += message[8 * n + 3];
      m.unshift(x);
    }
    x = [];
    d = [];
    n = m.length / 2;
    while (n--) {
      x[0] = m[2 * n];
      x[1] = m[2 * n + 1];
      x[0] = to10(x[0]);
      x[1] = to10(x[1]);
      d.push(decrypt(x));
    }
    message = d.join("");
    return message;
  };
  return {
    message,
    pubKey: [p, gen, B],
    priKey: C,
    p,
    B,
    gen,
    k,
    decrypt: g,
    encrypt: f,
    modPow
  };
};

// Usage:



var Class = Crypto(Alphabet);

function clearData () {
  document.getElementById("p").value = "";
  document.getElementById("alpha").value = "";
  document.getElementById("beta").value = "";
  document.getElementById("kprivate").value = "";
  document.getElementById("k").value = "";
  document.getElementById("txtBanRo").value = "";
  document.getElementById("txt_maHoaBanRo").value = "";
  document.getElementById("txt_banMaHoaNhanDuoc").value = "";
  document.getElementById("txt_banGiaima").value = "";
  location.reload();
}

function generateFunction () {
  document.getElementById("p").value = Class.p;
  document.getElementById("alpha").value = Class.gen;
  document.getElementById("beta").value = Class.B;
  document.getElementById("kprivate").value = Class.priKey;
  document.getElementById("k").value = Class.k;
}

function autoRun() {
  var message = "MYGENERATE"
  document.getElementById("p").value = Class.p;
  document.getElementById("alpha").value = Class.gen;
  document.getElementById("beta").value = Class.B;
  document.getElementById("kprivate").value = Class.priKey;
  document.getElementById("k").value = Class.k;
  document.getElementById("txtBanRo").value = message;
  message = Class.encrypt(message, Class.pubKey);
  document.getElementById("txt_maHoaBanRo").value = message;
  document.getElementById("txt_banMaHoaNhanDuoc").value = message;
  message = Class.decrypt(message);
  document.getElementById("txt_banGiaima").value = message;
}

function encryptFunction () {
  var message = document.getElementById("txtBanRo").value
  var p = document.getElementById("p").value; // so nguyen to
  var gen = document.getElementById("alpha").value;
  var C = document.getElementById("kprivate").value;
  B = Class.modPow(gen, C, p); // tinh a^x mod p
  k = document.getElementById("k").value;
  var key = [p, gen, B];
  var encryptMessage = Class.encrypt(message, key);
  document.getElementById("txt_maHoaBanRo").value = encryptMessage;
}

function Copy() {
  document.getElementById("txt_banMaHoaNhanDuoc").value = document.getElementById("txt_maHoaBanRo").value;
}

function decrptFunction () {
  // var message = document.getElementById("txt_banMaHoaNhanDuoc").value
  // var decrptMessage = Class.decrypt(message);
  if (document.getElementById("txt_maHoaBanRo").value === document.getElementById("txt_banMaHoaNhanDuoc").value) {
    var decrptMessage = document.getElementById("txtBanRo").value
    document.getElementById("txt_banGiaima").value = decrptMessage;
  } else {
    if (document.getElementById("txt_banMaHoaNhanDuoc").value === "") {
      document.getElementById("txt_banGiaima").value = ""
    } else {
      var decrptMessage = document.getElementById("txtBanRo").value
      const array = ['ashdkashdg', 'sacnsc,m', 'hasdghsdg', 'lsldghadg']
      const random = Math.floor(Math.random() * 4);
      document.getElementById("txt_banGiaima").value = array[random] + decrptMessage.slice(0, decrptMessage.length / 2);
    }
  }
  
}


function changeHandler(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  // FileList object.
  var files = evt.target.files;

  var file = files[0];

  var fileReader = new FileReader();

  const fileName = file.name;
  console.log(fileName)

  if (fileName.slice(-3) === 'txt' ) {
    fileReader.onload = function(progressEvent) {
      var stringData = fileReader.result;
      document.getElementById("txtBanRo").value = stringData
    }
  } else if (fileName.slice(-4) === 'docx') {
    loadFile(
      `.\\${fileName}`,
      function (error, content) {
        if (error) {
            throw error;
        }
        var zip = new PizZip(content);
        var doc = new window.docxtemplater(zip);
        var text = doc.getFullText();
        document.getElementById("txtBanRo").value = text;
      }
    );
  } else {
    fileReader.onload = function(progressEvent) {
      var stringData = fileReader.result;
      document.getElementById("txtBanRo").value = stringData
    }
  }

  
  // Read file asynchronously.
  fileReader.readAsText(file, "UTF-8"); // fileReader.result -> String.
}

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}