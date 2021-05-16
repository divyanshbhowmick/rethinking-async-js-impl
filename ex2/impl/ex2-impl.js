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

function output(text) {
	console.log(text);
}

// **************************************

function produceThunk(fn) {
	let args = [].slice.call(arguments, 1);
	return function (cb) {
		args.push(cb);
		fn.apply(null, args);
	};
}

// Trynig to make it a active thunk
function getFile(file) {
	// what do we do here?
	// We just need to bridge the two function the main fucntion to be called and the one that is to be returned (aka thunk)
	let text, fn;
	fakeAjax(file, function (resp) {
		if (fn) fn(resp);
		else text = resp;
	});
	return function (cb) {
		if (text) cb(text);
		else fn = cb;
	};
}

/**
 * Thunk - Thunk is pure function which calls a function and provides a wrapper kind of thing. it can be synchrounous as well as async..
 * async thunks have a callback passed to call it when the function is called.
 *
 * Types of Thunks
 * 1) Active Thunk - It gets the job done initiallly(during the time of declaration) and we can consume it later by calling the thunk.
 * 2) Lazy Thunk - It doesn't gets the job done intially else it does it at the time of calling the thunk.
 * Note: Active thunk is one which does the job concurrently
 */

// request all files at once in "parallel"
const thunk1 = getFile("file1");
const thunk2 = getFile("file2");
const thunk3 = getFile("file3");

// consuming the response sequentially

thunk1(function (text1) {
	output(text1);
	thunk2(function (text2) {
		output(text2);
		thunk3(function (text3) {
			output(text3);
			output("Complete!");
		});
	});
});
