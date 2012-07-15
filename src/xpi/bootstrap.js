var { classes: Cc, interfaces: Ci, utils: Cu } =  Components;

Cu.import("resource://gre/modules/Services.jsm");

var scopes = {};
var baseURI;
function require(module)
{
  if (!(module in scopes))
  {
    let url = baseURI.spec + 'lib/' + module + ".js";
    scopes[module] = {
      require: require,
      exports: {}
    };
    Services.scriptloader.loadSubScript(url, scopes[module]);
  }
  return scopes[module].exports;
}

function startup(data)
{
	baseURI = Services.io.newFileURI(data.installPath);

	require('noscript').enableJS();

	require('resource').setResource(Services.io.newURI('resource/', null, baseURI));
	require('adblock').setEnabled(true);
	require('inject').setEnabled(true);
}

function shutdown(data)
{
	require('resource').setResource(null);
	require('adblock').setEnabled(false);
	require('inject').setEnabled(false);
}

function install(){}
function uninstall(){}