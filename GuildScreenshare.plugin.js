//META{"name":"GuildScreenshare","source":"https://raw.githubusercontent.com/Slappy826/BdPlugins/master/GuildScreenshare.plugin.js"}*//

class GuildScreenshare {

	getName() { return "Guild Screenshare"; }
	getDescription() { return "Allows you to screenshare in any guild."; }
	getVersion() { return "0.0.5"; }
	getAuthor() { return "Slappy826#0001"; }
	load() {
		this.clipboard = require("electron").clipboard;
	}

	start() {
		var mods = BdApi.findAllModules(x => x.getMetaData);
		for(let i in mods) {
			if(mods[i].getMetaData().title == "Guild Video"){
				this.unpatch = BdApi.monkeyPatch(mods[i], "isAvailable", {
					instead: e => {
						return true;
					}
				});
			}
		}
	}

	stop() {
        this.unpatch();
	}
}
