// Main script for QUnit testing
// See https://qunitjs.com/intro/#browser-support
// Updated to v2.19.4

var inputVals = {0 : "U",1: "L",2:"D",3:"R",4:"A",tick:"T",undo:" UNDO ",restart:" RESTART "};

// Pre-configuration as documented does not work, but this way does

QUnit.config.autostart = true;
QUnit.config.testTimeout = 5000;
QUnit.config.urlConfig.push({
		id: "showsource",
		label: "Show source",
		tooltip: "Enabling this will show the source code, if needed."
	});

// allow tests to be run over a range
const testfirst = 0;
const testhowmany = 9999;
const msgfirst = 0;
const msghowmany = 9999;

// run tests that check for correct result in final level, seed and sound
QUnit.module('PS execution', function() {
	for (var i = testfirst; i < testfirst + testhowmany && i < testdata.length; i++) {
		QUnit.test(
			testdata[i][0], 
			function(num){
				return function(){
					var td = testdata[num];
					var testcode = td[1][0];
					var testinput=td[1][1];
					var testresult=td[1][2];
					var targetlevel=td[1][3];
					var randomseed=td[1][4];
					var audiooutput=td[1][5];
					var input="";
					for (var j=0;j<testinput.length;j++) {
						if (j%5==0 && j>0) {
							input+=" ";
						}
						input += inputVals[testinput[j]];
					}
					var errormessage = "Output did not match. Input: [" + input +"], level ID: "+ td[1][3]+"\nExpected result:\n"+testresult+"\n";
					errormessage += "\ntargetlevel : "+targetlevel;
					if (randomseed!==undefined) {
						errormessage += "\nrandomseed : "+randomseed;
					}
					if (audiooutput!==undefined) {
						errormessage += "\naudioinput : "+audiooutput.join(";");
					}
					if (QUnit.config.showsource) errormessage += "\nSource code:\n" + testcode;
					QUnit.assert.true(runTest(td[1]),errormessage);
				};
			}(i)
		);
	}
});

// run compiler tests that check for correct number and text of error messages
// allow tests to be run over a range
QUnit.module('PS compiler', function () {
	for (var i = msgfirst; i < msgfirst + msghowmany && i < errormessage_testdata.length; i++) {
		QUnit.test(
			"🐛" + errormessage_testdata[i][0],
			function (num) {
				return function () {
					var td = errormessage_testdata[num];
					var testcode = td[1][0];
					var testerrors = td[1][1];
					if (td[1].length !== 3) {
						throw "Error/Warning message testdata has wrong number of fields, invalid. Accidentally pasted in level recording data?" + "\n\n\n" + testcode;
					}
					var errormessage = `Desired errors : ${testerrors}`;
					//var errormessage =  testcode+"\n\n\ndesired errors : "+testerrors;
					if (QUnit.config.showsource) errormessage += "\nSource code:\n" + testcode;
					QUnit.assert.true(runCompilationTest(td[1]), errormessage);
				};
			}(i)
		);
	}
});