#!/usr/bin/env node
// Simple MCP time server for UTC+2 (Africa/Johannesburg)
// No dependencies — pure Node.js

const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin });

function getTime() {
  const now = new Date();
  const utc2 = new Date(now.getTime() + (2 * 60 * 60 * 1000));
  const pad = n => String(n).padStart(2, '0');
  return `${utc2.getUTCFullYear()}-${pad(utc2.getUTCMonth()+1)}-${pad(utc2.getUTCDate())} ${pad(utc2.getUTCHours())}:${pad(utc2.getUTCMinutes())}`;
}

function send(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

rl.on('line', line => {
  let msg;
  try { msg = JSON.parse(line); } catch { return; }

  if (msg.method === 'initialize') {
    send({ jsonrpc: '2.0', id: msg.id, result: {
      protocolVersion: '2025-11-25',
      capabilities: { tools: {} },
      serverInfo: { name: 'time-utc2', version: '1.0.0' }
    }});
  } else if (msg.method === 'notifications/initialized') {
    // no response needed
  } else if (msg.method === 'tools/list') {
    send({ jsonrpc: '2.0', id: msg.id, result: { tools: [{
      name: 'get_current_time',
      description: 'Returns the current date and time in UTC+2 (Africa/Johannesburg)',
      inputSchema: { type: 'object', properties: {}, required: [] }
    }]}});
  } else if (msg.method === 'tools/call' && msg.params?.name === 'get_current_time') {
    send({ jsonrpc: '2.0', id: msg.id, result: {
      content: [{ type: 'text', text: getTime() }]
    }});
  } else if (msg.id !== undefined) {
    send({ jsonrpc: '2.0', id: msg.id, error: { code: -32601, message: 'Method not found' }});
  }
});

process.stderr.write('MCP time-utc2 server running\n');
