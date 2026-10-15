export const skillGroups = [
  { id: 'backend', title: 'Backend / Server', tech: ['Node.js', 'Express', 'Python', 'Flask', 'MySQL', 'SQLite', 'REST APIs'] },
  { id: 'systems', title: 'Systems & Infrastructure', tech: ['Linux', 'MQTT', 'Raspberry Pi', 'AWS', 'Docker'] },
  { id: 'client', title: 'App / Client', tech: ['Flutter', 'Dart', 'WebView', 'TypeScript', 'Vite'] },
  { id: 'tools', title: 'Languages & Tools', tech: ['C', 'Go', 'JavaScript', 'SQL', 'GitHub Actions'] },
] satisfies { id: string; title: string; tech: string[] }[];

export const skillIcons: Record<string, string> = {
  'Node.js': 'nodedotjs', Express: 'express', Python: 'python', Flask: 'flask', MySQL: 'mysql', SQLite: 'sqlite', 'REST APIs': 'rest-apis',
  Linux: 'linux', MQTT: 'mqtt', 'Raspberry Pi': 'raspberrypi', AWS: 'amazonwebservices', Docker: 'docker',
  Flutter: 'flutter', Dart: 'dart', WebView: 'webview', 'Drift / SQLite': 'sqlite', TypeScript: 'typescript', Vite: 'vite',
  C: 'c', Go: 'go', JavaScript: 'javascript', SQL: 'sql', 'GitHub Actions': 'githubactions',
};
