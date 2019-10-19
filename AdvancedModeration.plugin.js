//META{"name":"AdvancedModeration","source":"https://raw.githubusercontent.com/Slappy826/BdPlugins/master/AdvancedModeration.plugin.js"}*//

var createElement = BdApi.React.createElement;

var MoveElement = function (e) {
	var chan = e.channel;
	var channels = BdApi.findModuleByProps("GUILD_SELECTABLE_CHANNELS_KEY").default.getChannels(chan.guild_id)[2];

	var renderItems = channels.map(function (e) {
		return createElement(BdApi.findModuleByDisplayName("MenuItem"), {
			action: () => {
				BdApi.findModuleByProps("closeContextMenu").closeContextMenu();

				var voiceModule = BdApi.findModuleByProps("setChannel", "setServerDeaf", "setServerMute");
				BdApi.findModuleByProps("getVoiceStatesForChannel").getVoiceStatesForChannel(chan)
					.forEach(x => {
						voiceModule.setChannel(chan.guild_id, x.userId, e.channel.id);
					});
			},
			label: e.channel.name
		});
	});

	return createElement(BdApi.findModuleByDisplayName("FluxContainer(SubMenuItem)"), {
		label: "Move To",
		render: renderItems
	});
};
MoveElement.displayName = "GuildMoveToItem";

class AdvancedModeration {

	getName() { return "Advanced Moderation"; }
	getDescription() { return "Helpful moderation tools" }
	getVersion() { return "0.0.1"; }
	getAuthor() { return "Slappy826#0001"; }

	load() {}

	start() {
    ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), 'https://raw.githubusercontent.com/Slappy826/BdPlugins/master/AdvancedModeration.plugin.js');
		this.voiceModule = BdApi.findModuleByProps("setChannel", "setServerDeaf", "setServerMute");
		this.unpatch = BdApi.monkeyPatch(BdApi.findModuleByDisplayName("ChannelContextMenu").prototype, "render", {
			after: e => {
				try{
					if(e.thisObject.props.type == "CHANNEL_LIST_VOICE") {
						var menuItem = BdApi.findModuleByDisplayName("MenuItem");

						var permsModule = BdApi.findModuleByProps("can", "_dispatchToken");
						var perms = BdApi.findModuleByProps("Permissions").Permissions;
						var moveMembers = permsModule.can(perms.MOVE_MEMBERS, e.thisObject.props.channel);

						e.returnValue.props.children.push(createElement("div", {className: BdApi.findModuleByProps("itemGroup").itemGroup},
						
						moveMembers ? createElement(menuItem, {
							label: "Disconnect All",
							action: () => {
								BdApi.findModuleByProps("closeContextMenu").closeContextMenu();

								var chan = e.thisObject.props.channel;
								BdApi.findModuleByProps("getVoiceStatesForChannel").getVoiceStatesForChannel(chan)
									.forEach(x => {
										this.voiceModule.setChannel(chan.guild_id, x.userId, null);
									});
							},
							danger: true
						}) : null,

						moveMembers ? createElement(MoveElement, {
							channel: e.thisObject.props.channel
						}) : null

						));
					}
				}
				catch(e) {}

				return e.returnValue;
			}
		});
	}

	stop() {
		this.unpatch();
	}
}
