(function () {
	'use strict';

	var _ = require('lodash'),
		argv = require('optimist').argv,
		fs = require('fs'),
		recursive = require('recursive-readdir'),
		Q = require('q');

	if (!checkArgv()) {
		process.exit(1);
	}

	fs.stat(argv.learn, function (err, stats) {
		if (err) {
			dieError(err);
		}

		if (stats.isFile()) {
			startMarkov([argv.learn]);
		} else if (stats.isDirectory()) {
			recursive(argv.learn, function (err, files) {
				if (err) {
					dieError(err);
				}

				startMarkov(files);
			});
		} else {
			dieError("Expecting a directory or a file as the argument to --learn");
		}
	});

	function startMarkov(files) {
		learnFiles(files)
			.then(babble)
			.done();
	}

	function learnFiles(files) {
		var defer = Q.defer();

		var projection = {};

		_(files).forEach(function (file) {
			var data = fs.readFileSync(file, { encoding: 'utf8' });

			var words = data.split(/\s+/);

			for (var tokenCount = 0; tokenCount < words.length - (argv.window || 1); tokenCount ++) {
				var prefix = words[tokenCount];
				var slice = words.slice(tokenCount + 1, tokenCount + (argv.window || 1) + 1);

				if (projection.hasOwnProperty(prefix)) {
					projection[prefix].push(slice);
				} else {
					projection[prefix] = [slice];
				}
			}
		});

		defer.resolve(projection);

		return defer.promise;
	}

	function babble(projection) {
		var generatedTokens = [];

		var lastToken = argv.start ? argv.start :  _(projection).keys().shuffle().first();
		generatedTokens.push(lastToken);

		for (var i = 0; i < argv.quantity - 1; i++) {
			var nextTokens = _(projection[lastToken]).shuffle().first();

			if (_.isArray(nextTokens) && nextTokens.length > 0) {
				generatedTokens = generatedTokens.concat(nextTokens);

				lastToken = nextTokens[nextTokens.length - 1];
			} else {
				break;
			}
		}

		console.log(generatedTokens.join(' '));
	}

	function checkArgv() {
		if (!_.isString(argv.learn) || !_.isNumber(argv.quantity) || argv.quantity <= 0) {
			console.log("Usage: --learn path --quantity num [--window num] [--start token]");

			return false;
		}

		return true;
	}

	function dieError(err) {
		console.log(err);
		process.exit(1);
	}
})();