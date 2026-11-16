#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const home = process.env.CREWLY_HOME || '/home/node/.crewly';
const teamId = 'af30c001-2789-4f20-b917-000000000010';
const args = process.argv.slice(2);
const option = name => {const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined;};
const since = option('--since') ? Date.parse(option('--since')) : 0;
if (!Number.isFinite(since)) throw new Error('Invalid --since date');

const require = createRequire(import.meta.url);
const Database = require('/usr/local/lib/node_modules/crewly/node_modules/better-sqlite3');
const db = new Database(path.join(home, 'chat.db'), {readonly: true});
const team = JSON.parse(fs.readFileSync(path.join(home, 'teams', teamId, 'config.json'), 'utf8'));
const channel = db.prepare("SELECT id FROM chat_channels WHERE team_id = ? AND name = '#general' AND archived_at IS NULL").get(teamId);
if (!channel) throw new Error('AtelierX #general channel not found');

const rows = db.prepare('SELECT id, sender_type, sender_id, sender_kind, agent_session, metadata, content, thread_id, created_at FROM chat_messages WHERE channel_id = ? AND created_at >= ? ORDER BY created_at').all(channel.id, since);
const thread = option('--thread');
const filtered = thread ? rows.filter(row => row.id === thread || row.thread_id === thread) : rows;
function authorOf(row) {
  if (row.sender_type === 'agent') return row.agent_session || row.sender_id;
  if (row.sender_kind !== 'agent' || !row.metadata) return null;
  try {return JSON.parse(row.metadata).authorAgentSession || null;} catch {return null;}
}
const members = team.members.map(member => {
  const authored = filtered.filter(row => authorOf(row) === member.agentId);
  return {
    name: member.name,
    session: member.agentId,
    messages: authored.length,
    received: authored.filter(row => /NHẬN VIỆC/i.test(row.content)).length,
    handedOff: authored.filter(row => /BÀN GIAO/i.test(row.content)).length,
    ids: authored.map(row => row.id),
  };
});
const summary = {
  channelId: channel.id,
  thread: thread || null,
  since: since || null,
  userMessages: filtered.filter(row => row.sender_type === 'user' && !authorOf(row)).length,
  agentMessages: filtered.filter(row => !!authorOf(row)).length,
  members,
};
if (args.includes('--check-api')) {
  const token = fs.readFileSync(path.join(home, 'api-token'), 'utf8').trim();
  const response = await fetch(`http://127.0.0.1:${process.env.WEB_PORT || 8787}/api/chat/channels/${channel.id}/messages?limit=200`, {headers:{authorization:`Bearer ${token}`}});
  const body = await response.json();
  if (!response.ok) throw new Error(`Chat API returned HTTP ${response.status}`);
  const messages = Array.isArray(body.data) ? body.data : body.data?.messages || body.data?.items || [];
  const expected = new Map(filtered.filter(row => authorOf(row)).map(row => [row.id, authorOf(row)]));
  const mismatches = messages.filter(message => expected.has(message.id) && (message.senderType !== 'agent' || message.senderId !== expected.get(message.id))).map(message => message.id);
  summary.api = {checked: messages.length, expectedAgentMessages: expected.size, mismatches};
  if (mismatches.length) process.exitCode = 1;
}
console.log(JSON.stringify(summary, null, 2));
if (args.includes('--require-all') && members.some(member => member.received === 0 || member.handedOff === 0)) process.exitCode = 1;
