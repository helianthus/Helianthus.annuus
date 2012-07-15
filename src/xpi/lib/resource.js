(function()
{
	exports.setResource = function(URI)
	{
		Cu.import("resource://gre/modules/FileUtils.jsm");
		Services.io.getProtocolHandler("resource").QueryInterface(Ci.nsIResProtocolHandler).setSubstitution('annuus', URI || null);
	};
})();
