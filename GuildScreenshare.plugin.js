//META{"name":"GuildScreenshare","source":"https://raw.githubusercontent.com/Slappy826/BdPlugins/master/GuildScreenshare.plugin.js"}*//

class GuildScreenshare {

	getName() { return "Guild Screenshare"; }
	getDescription() { return "Allows you to screenshare in any guild."; }
	getVersion() { return "0.0.4"; }
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
		
		this.unpatchRender = BdApi.monkeyPatch(BdApi.findModuleByDisplayName("ChannelContextMenu").prototype, "render", {
			after: e => {
				try{
					if(e.thisObject.props.type == "CHANNEL_LIST_VOICE") {
						var menuItem = BdApi.findModuleByDisplayName("MenuItem");
						e.returnValue.props.children.push(BdApi.React.createElement("div", {className: BdApi.findModuleByProps("itemGroup").itemGroup},
							BdApi.React.createElement(menuItem, {
								label: "Copy link",
								action: () => {
									BdApi.findModuleByProps("closeContextMenu").closeContextMenu();

									var chan = e.thisObject.props.channel;
									this.clipboard.writeText("https://discordapp.com/channels/" + chan.guild_id + "/" + chan.id);
								}
							})
						));
					}
				}
				catch(err) {}
				return e.returnValue;
			}
		});
	}

	stop() {
        this.unpatch();
		this.unpatchRender();
	}
}
