import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: FileTreeNode[];
}

const BACKUP_DIR = path.join(process.cwd(), '.jarvis_backups');

export async function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    await fs.promises.mkdir(BACKUP_DIR, { recursive: true });
  }
}

export async function createBackup(filePath: string): Promise<string | null> {
  try {
    await ensureBackupDir();
    const fullPath = path.resolve(process.cwd(), filePath.replace(/^\/+/, ''));
    if (!fs.existsSync(fullPath)) return null;

    const content = await fs.promises.readFile(fullPath, 'utf8');
    const safeName = filePath.replace(/[^a-zA-Z0-9._-]/g, '_');
    const backupId = `bkp_${Date.now()}_${safeName}`;
    const backupFilePath = path.join(BACKUP_DIR, `${backupId}.bak`);
    
    await fs.promises.writeFile(backupFilePath, content, 'utf8');

    // Also write metadata
    const metaPath = path.join(BACKUP_DIR, `${backupId}.json`);
    await fs.promises.writeFile(
      metaPath,
      JSON.stringify({
        id: backupId,
        originalPath: filePath,
        timestamp: new Date().toISOString(),
        size: Buffer.byteLength(content),
      }, null, 2),
      'utf8'
    );

    return backupId;
  } catch (err) {
    console.error('Backup creation failed:', err);
    return null;
  }
}

export function setupEditorRoutes(app: any) {
  // 1. Get Project File Tree
  app.get('/api/jarvis/files', async (_req: Request, res: Response) => {
    try {
      const rootDir = process.cwd();
      const ignored = new Set(['node_modules', '.git', 'dist', '.jarvis_backups', 'bun.lock']);

      async function scanDir(currentDir: string, relativePath: string = ''): Promise<FileTreeNode[]> {
        const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
        const nodes: FileTreeNode[] = [];

        for (const entry of entries) {
          if (ignored.has(entry.name) || entry.name.startsWith('.')) continue;

          const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
          const fullPath = path.join(currentDir, entry.name);

          if (entry.isDirectory()) {
            const children = await scanDir(fullPath, relPath);
            nodes.push({
              name: entry.name,
              path: relPath,
              type: 'directory',
              children,
            });
          } else {
            const stat = await fs.promises.stat(fullPath);
            nodes.push({
              name: entry.name,
              path: relPath,
              type: 'file',
              size: stat.size,
            });
          }
        }

        // Sort: directories first, then files alphabetically
        return nodes.sort((a, b) => {
          if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
      }

      const tree = await scanDir(rootDir);
      return res.json({ tree });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to read file tree', details: err.message });
    }
  });

  // 2. Read single file content
  app.get('/api/jarvis/file/read', async (req: Request, res: Response) => {
    const rawPath = req.query.path as string;
    if (!rawPath) return res.status(400).json({ error: 'File path required' });

    try {
      const sanitized = rawPath.replace(/^\/+/, '');
      const fullPath = path.resolve(process.cwd(), sanitized);

      // Path traversal security check
      if (!fullPath.startsWith(process.cwd())) {
        return res.status(403).json({ error: 'Access denied: outside workspace bounds' });
      }

      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: 'File not found' });
      }

      const stat = await fs.promises.stat(fullPath);
      if (stat.isDirectory()) {
        return res.status(400).json({ error: 'Target is a directory, not a file' });
      }

      const content = await fs.promises.readFile(fullPath, 'utf8');
      const lines = content.split('\n').length;
      const extension = path.extname(sanitized);

      return res.json({
        path: sanitized,
        content,
        lines,
        size: stat.size,
        extension,
        lastModified: stat.mtime.toISOString(),
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to read file', details: err.message });
    }
  });

  // 3. Write file content with automatic backup
  app.post('/api/jarvis/file/write', async (req: Request, res: Response) => {
    const { path: rawPath, content } = req.body;
    if (!rawPath || typeof content !== 'string') {
      return res.status(400).json({ error: 'Valid path and string content required' });
    }

    try {
      const sanitized = rawPath.replace(/^\/+/, '');
      const fullPath = path.resolve(process.cwd(), sanitized);

      if (!fullPath.startsWith(process.cwd())) {
        return res.status(403).json({ error: 'Access denied: outside workspace bounds' });
      }

      // Create backup before writing
      const backupId = await createBackup(sanitized);

      // Write new content
      await fs.promises.writeFile(fullPath, content, 'utf8');

      return res.json({
        success: true,
        path: sanitized,
        backupId,
        size: Buffer.byteLength(content),
        message: 'File saved successfully with automated recovery backup checkpoint.',
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to write file', details: err.message });
    }
  });

  // 4. Validate TypeScript / Code syntax
  app.post('/api/jarvis/file/validate', async (_req: Request, res: Response) => {
    try {
      const { stdout, stderr } = await execAsync('npm run lint', { timeout: 15000 });
      return res.json({
        valid: true,
        output: stdout || 'TypeScript compilation clean. No syntax or type errors detected.',
      });
    } catch (err: any) {
      return res.json({
        valid: false,
        error: err.stdout || err.stderr || err.message,
      });
    }
  });
}
