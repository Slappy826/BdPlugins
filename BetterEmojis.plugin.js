//META{"name":"BetterEmojis","source":"https://raw.githubusercontent.com/Slappy826/BdPlugins/master/BetterEmojis.plugin.js"}*//

class BetterEmojis {

	getName() { return "Better Emojis"; }
	getDescription() { return "improving emojis because of bad choices other people made : )" }
	getVersion() { return "0.0.3"; }
	getAuthor() { return "Slappy826#0001"; }

	load() {}

	start() {
		this.unpatch = BdApi.monkeyPatch(BdApi.findModuleByProps("getURL"), "getURL", {
			instead: e => {
				if(e.methodArguments[0] == "⛓" || e.methodArguments[0] == "⛓️") {
					return "https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/26d3.png";
				}
				else if(e.methodArguments[0] == "🇲🇵") {
					return "https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f1f2-1f1f5.png"
				}
				else if(e.methodArguments[0] == "🔫") {
					return "https://raw.githubusercontent.com/twitter/twemoji/42d27cd00ad8caa99577f7c9ff752a471e6ed9a5/72x72/1f52b.png";
				}
				else if(e.methodArguments[0] == "🇺🇳") {
					return "https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f1fa-1f1f3.png";
				}
				return e.callOriginalMethod();
			}
		});
	}

	stop() {
		this.unpatch();
	}
}
