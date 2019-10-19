//META{"name":"NoChainsLag","source":"https://raw.githubusercontent.com/Slappy826/BdPlugins/master/NoChainsLag.plugin.js"}*//

class NoChainsLag {

	getName() { return "No Chains Lag"; }
	getDescription() { return "Replaces the chains emote with a png to reduce lag caused by the complex svg emote." }
	getVersion() { return "0.0.2"; }
	getAuthor() { return "Slappy826#0001"; }

	load() {}

	start() {
		this.unpatch = BdApi.monkeyPatch(BdApi.findModuleByProps("getURL"), "getURL", {
			instead: e => {
				if(e.methodArguments[0] == "?") {
					return "https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/26d3.png";
				}
				return e.callOriginalMethod();
			}
		});
	}

	stop() {
		this.unpatch();
	}
}
