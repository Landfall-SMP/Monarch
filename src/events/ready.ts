import { Events, ActivityType } from 'discord.js';
import type { Event } from './index.js';

export default {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		client.user.setActivity({
			name: 'over the Landfall SMP',
			type: ActivityType.Watching,
		});

		console.log(`✅ Ready! Logged in as ${client.user.tag}`);
	},
} satisfies Event<Events.ClientReady>;
