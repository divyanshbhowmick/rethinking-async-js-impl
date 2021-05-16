function fakeAjax(url, cb) {
  var fake_responses = {
    file1: "The first text",
    file2: "The middle text",
    file3: "The last text",
  };
  var randomDelay = (Math.round(Math.random() * 1e4) % 8000) + 1000;

  console.log("Requesting: " + url);

  setTimeout(function () {
    cb(fake_responses[url]);
  }, randomDelay);
}

function output(...text) {
  console.log(...text);
}

// **************************************
// The old-n-busted callback way

function getFile(file) {
  fakeAjax(file, function (text) {
    handleResponse(file, text);
  });
}

let response = {};

function handleResponse(file, text) {
  if (!response[file]) response[file] = text;
  let files = ["file1", "file2", "file3"];

  for (file of files) {
    if (file in response) {
      if (typeof response[file] === "string") {
        output(response[file]);
        response[file] = true;
      }
    } else return;
  }
  output("Complete!");
}

// request all files at once in "parallel"
getFile("file1");
getFile("file2");
getFile("file3");
