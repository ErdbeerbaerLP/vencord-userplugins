import { getUserSettingLazy } from "@api/UserSettings";
import { PluginNative } from "@utils/types";
import { findByCode, findByPropsLazy, findStoreLazy } from "@webpack";
import { ChannelStore, FluxDispatcher, PermissionStore, PermissionsBits, RestAPI, SelectedChannelStore, UserStore } from "@webpack/common";
import { settings } from ".";

const ShowCurrentGame = getUserSettingLazy<boolean>("status", "showCurrentGame")!;
const ChannelActions: {
    disconnect: () => void;
    selectVoiceChannel: (channelId: string) => void;
} = findByPropsLazy("disconnect", "selectVoiceChannel");
const VoiceStateStore = findStoreLazy("VoiceStateStore");
const Native = VencordNative.pluginHelpers.RemoteAPI as PluginNative<typeof import("./native")>;


export async function handle(result) {
    switch (result.cmd.method) {
        case "getGameActivity":
            fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
                method: 'POST', mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ num: result.num, payload: { value: ShowCurrentGame.getSetting() } })
            });
            return;

        case "getVC":
            var ch = SelectedChannelStore.getVoiceChannelId();
            if (typeof ch == "undefined")
                fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
                    method: 'POST', mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ num: result.num, payload: { channelId: 0 } })
                });
            else
                fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
                    method: 'POST', mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ num: result.num, payload: { channelId: ch } })
                });
            return;

        case "toggleGameActivity":
            var targetValue = !ShowCurrentGame.getSetting();
            if (typeof result.cmd.value != "undefined") {
                targetValue = result.cmd.value;
            }
            await ShowCurrentGame.updateSetting(targetValue);
            fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
                method: 'POST', mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ num: result.num, payload: { value: ShowCurrentGame.getSetting() } })
            });
            return;
        case "setStreamerMode":
            var targetValue = true;
            if (typeof result.cmd.value != "undefined") {
                targetValue = result.cmd.value;
            }
            await FluxDispatcher.dispatch({
                type: "STREAMER_MODE_UPDATE",
                key: "enabled",
                value: targetValue
            });
            fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
                method: 'POST', mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ num: result.num, payload: { value: targetValue } })
            });
            return;
        case "toggleMuted":
            await FluxDispatcher.dispatch({
                type: "AUDIO_TOGGLE_SELF_MUTE",
                skipMuteUnmuteSoundEffect: !settings.store.muteDeafSound
            });
            fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
                method: 'POST', mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ num: result.num, payload: {} })
            });

            return;
        case "toggleDeafened":
            await FluxDispatcher.dispatch({
                type: "AUDIO_TOGGLE_SELF_DEAF",
                skipMuteUnmuteSoundEffect: !settings.store.muteDeafSound
            });
            fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
                method: 'POST', mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ num: result.num, payload: {} })
            });
            return;
        case "vcJoin":
            var r = {};
            if (typeof result.cmd.channel == "undefined") {
                r = { success: false, reason: "No Channel ID defined" };
            } else if (typeof result.cmd.channel == "number") {
                r = { success: false, reason: "Channel ID must be string" };
            } else {
                const channel = ChannelStore.getChannel(result.cmd.channel);
                const voiceStates = VoiceStateStore.getVoiceStatesForChannel(result.cmd.channel);
                const memberCount = voiceStates ? Object.keys(voiceStates).length : null;
                if (channel.type === 1 || PermissionStore.can(1n << 20n, channel)) {
                    if (typeof channel.userLimit !== "undefined" && channel.userLimit !== 0 && memberCount !== null && memberCount >= channel.userLimit && !PermissionStore.can(PermissionsBits.MOVE_MEMBERS, channel)) {
                        r = { success: false, reason: "Channel is full" };
                    } else {
                        ChannelActions.selectVoiceChannel(result.cmd.channel);
                        r = { success: true };
                    }
                } else {
                    r = { success: false, reason: "Missing permission" };
                }
            }
            if (result.cmd.call) {
                await FluxDispatcher.dispatch({
                    type: "CALL_ENQUEUE_RING",
                    channelId: result.cmd.channel
                });
            }
            fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
                method: 'POST', mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ num: result.num, payload: r })
            });

            return;
        case "vcLeave":
            var r = {};
            ChannelActions.disconnect();
            r = { success: true };
            fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
                method: 'POST', mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ num: result.num, payload: r })
            });
            return;
        case "getUser":
            var usr = UserStore.getCurrentUser();
            fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
                method: 'POST', mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ num: result.num, payload: usr })
            });
            return;
        case "setVolume":
            var volume = -1.0;
            var userid = -1;
            if (typeof result.cmd.user != "undefined") {
                userid = result.cmd.user;
            }
            if (typeof result.cmd.volume != "undefined") {
                volume = result.cmd.volume;
            }
            if (volume < 0 || userid < 0) {
                fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
                    method: 'POST', mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ num: result.num, payload: { success: false, reason: "Value(s) unset" } })
                });
                return;
            }
            await FluxDispatcher.dispatch({
                type: "AUDIO_SET_LOCAL_VOLUME",
                volume: findByCode("Math.pow(10", "50-50")(volume),
                userId: userid
            });
            fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
                method: 'POST', mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ num: result.num, payload: { success: true } })
            });
            return;

        case "sendMessage":
            var channel = -1.0;
            var message = "";
            if (typeof result.cmd.channel != "undefined") {
                channel = result.cmd.channel;
            }
            if (typeof result.cmd.msg != "undefined") {
                message = result.cmd.msg;
            }
            if (channel < 0 || message == "") {
                fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
                    method: 'POST', mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ num: result.num, payload: { success: false, reason: "Value(s) unset" } })
                });
                return;
            }
            await RestAPI.post({
                url: `/channels/${channel}/messages`,
                body: { content: message, tts: false, flags: 0 }
            });
            fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
                method: 'POST', mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ num: result.num, payload: { success: true } })
            });
            return;

        case "playSound":
            var ch = SelectedChannelStore.getVoiceChannelId();
            const usrid = UserStore.getCurrentUser().id;
            var bdy;
            if (typeof result.cmd.body != "undefined") {
                bdy = result.cmd.body;
            }
            if (typeof ch == "undefined") {
                fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
                    method: 'POST', mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ num: result.num, payload: { success: false, reason: "Not in a VC" } })
                });
                return;
            }


            await FluxDispatcher.dispatch({
                type: "GUILD_SOUNDBOARD_SOUND_PLAY_LOCALLY",
                sound: {
                    available: bdy.available,
                    emojiId: bdy.emoji_id,
                    emojiName: bdy.emoji_name,
                    soundId: bdy.sound_id,
                    name: bdy.name,
                    volume: bdy.volume
                },
                trigger: 1,
                channelId: ch

            });
            await RestAPI.post({
                url: `/channels/${ch}/send-soundboard-sound`,
                body: bdy
            });
            fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
                method: 'POST', mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ num: result.num, payload: { success: true } })
            });
            return;
    }
}
