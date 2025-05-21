import process from 'node:process';
import { URL } from 'node:url';
import { API } from '@discordjs/core/http-only';
import { REST, Routes } from 'discord.js';
import { loadCommands } from './loaders.js';

const commands = await loadCommands(new URL('../commands/', import.meta.url));
const commandData = [...commands.values()].map((command) => command.data);
console.log("Command data being registered:", commandData.map(c => c.name));

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
const api = new API(rest);

// Delete all existing commands!
console.log('Attempting to delete all existing application commands.');
await rest.put(
	Routes.applicationCommands(process.env.APPLICATION_ID!),
	{ body: [] },
)
.then(() => console.log('Successfully deleted all application commands.'))
.catch(console.error);

console.log('Registering new commands...');
const result = await api.applicationCommands.bulkOverwriteGlobalCommands(process.env.APPLICATION_ID!, commandData);

console.log(`Successfully registered ${result.length} commands.`);
