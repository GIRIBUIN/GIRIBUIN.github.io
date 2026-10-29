import { existsSync } from 'node:fs';
import { join } from 'node:path';
import rehypeMermaid from 'rehype-mermaid';

const browserPaths = process.platform === 'win32' ? [
  join(process.env['ProgramFiles(x86)'] || 'C:/Program Files (x86)', 'Microsoft/Edge/Application/msedge.exe'),
  join(process.env.ProgramFiles || 'C:/Program Files', 'Google/Chrome/Application/chrome.exe'),
] : [];
const executablePath = process.env.MERMAID_BROWSER_PATH || browserPaths.find(existsSync);

// Render while compiling Markdown. The published page contains SVG, not Mermaid JS.
export default function rehypeDiagrams() {
  const render = rehypeMermaid({
    strategy: 'inline-svg',
    launchOptions: executablePath ? { executablePath } : {},
    css: new URL('../styles/diagram-font.css', import.meta.url),
    mermaidConfig: {
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      htmlLabels: false,
      fontFamily: 'Pretendard Variable, sans-serif',
      fontSize: 16,
      deterministicIds: true,
      deterministicIDSeed: 'portfolio',
      flowchart: {
        htmlLabels: false,
        nodeSpacing: 24,
        rankSpacing: 36,
        curve: 'linear',
        subGraphTitleMargin: { top: 12, bottom: 16 },
      },
      themeVariables: {
        primaryColor: '#16181c',
        primaryTextColor: '#f2f1ec',
        primaryBorderColor: '#839b91',
        lineColor: '#92979f',
        secondaryColor: '#1b1e23',
        tertiaryColor: '#111316',
        edgeLabelBackground: '#111316',
      },
    },
  });
  return {
    name: 'project-diagrams',
    async before(root, context) {
      const tree = JSON.parse(JSON.stringify(root));
      // Sätteri nodes are read-only; render a copy and replace through its API.
      await render(tree, {
        message(reason) {
          return new Error(`Mermaid in ${context.fileURL || 'Markdown'}: ${reason}`);
        },
      });
      const wrap = node => {
        if (!node.children) return;
        node.children = node.children.map(child => {
          if (child.tagName === 'svg' && String(child.properties?.id).startsWith('mermaid-')) {
            // Preserve the diagram's text size; wide diagrams scroll inside the figure.
            const width = Number(String(child.properties.viewBox).split(/\s+/)[2]);
            if (Number.isFinite(width) && width > 0) {
              child.properties.style = `${child.properties.style || ''};width:${width}px;max-width:none;`;
            }
            return {
              type: 'element',
              tagName: 'figure',
              properties: {
                className: ['project-diagram'],
                tabIndex: 0,
                ariaLabelledBy: child.properties.ariaLabelledBy,
              },
              children: [child, {
                type: 'element', tagName: 'button',
                properties: { type: 'button', className: ['diagram-expand'], ariaHasPopup: 'dialog' },
                children: [
                  { type: 'element', tagName: 'span', properties: { lang: 'en' }, children: [{ type: 'text', value: 'Expand diagram ↗' }] },
                  { type: 'element', tagName: 'span', properties: { lang: 'ko' }, children: [{ type: 'text', value: '다이어그램 확대 ↗' }] },
                ],
              }],
            };
          }
          wrap(child);
          return child;
        });
      };
      wrap(tree);
      context.replaceNode(root, tree);
    },
  };
}
