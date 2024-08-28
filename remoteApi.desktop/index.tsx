import definePlugin, { PluginNative, OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { makeRange } from "@components/PluginSettings/components";
import { handle } from "./serverHandling";

import { CopyIcon } from "@components/Icons";
import { Clipboard, Menu } from "@webpack/common";


const Native = VencordNative.pluginHelpers.RemoteAPI as PluginNative<typeof import("./native")>;
export const settings = definePluginSettings({
    ip: {
        type: OptionType.STRING,
        description: "IP to run API on. Recommended to leave at 127.0.0.1",
        default: "127.0.0.1"
    },
    port: {
        type: OptionType.NUMBER,
        description: "Port to run API on",
        default: 1249,
        markers: makeRange(1, 65534),
    },
    muteDeafSound: {
        type: OptionType.BOOLEAN,
        description: "Enable Mute / Deaf sound over API",
        default: true
    }
});


let started: boolean = false;
async function pollServer() {
    while (started) {

        await fetch(`http://${settings.store.ip}:${settings.store.port}/backend`, {
            method: 'GET', mode: 'cors'
        }).then(response => {
            return response.json();
        })
            .then(async result => {
                if (typeof result == "undefined" || typeof result.cmd == "undefined" || typeof result.cmd.method == "undefined") return;
                await handle(result);

            }).catch(error => console.error('Error:', error));

        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

export default definePlugin({
    name: "RemoteAPI",
    description: "API for remote control of Discord (experimental)",
    authors: [{ name: "ErdbeerbaerLP", id: 135802962013454336n, }],
    settings,
    dependencies: ["UserSettingsAPI"],
    start() {
        Native.start(settings.store.port, settings.store.ip);
        started = true;
        pollServer();
    },

    stop() {
        started = false;
        Native.stop();
    },
    contextMenus: {
        "sound-button-context": (children, { sound }) => {
            children.push(
                <Menu.MenuItem
                    id="vc-copy-soundboard-id"
                    label="Copy Sound JSON"
                    action={() => Clipboard.copy(JSON.stringify({ emoji_id: sound.emojiId, emoji_name: sound.emojiName, sound_id: sound.soundId, source_guild_id: sound.guildId, volume: sound.volume, available: sound.available }))}
                    icon={CopyIcon}
                />
            );
        },
    },
});
