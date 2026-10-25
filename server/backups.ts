import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { ensureBackupDir } from './editor.js';

const BACKUP_DIR = path.join(process.cwd(), '.jarvis_backups');

export function setupBackupRoutes(app: any) {
  // 1. List all backups
  app.get('/api/jarvis/backups', async (_req: Request, res: Response) => {
    try {
      await ensureBackupDir();
      const files = await fs.promises.readdir(BACKUP_DIR);
      const metaFiles = files.filter((f) => f.endsWith('.json'));

      const backups = [];
      for (const metaFile of metaFiles) {
        try {
          const raw = await fs.promises.readFile(path.join(BACKUP_DIR, metaFile), 'utf8');
          backups.push(JSON.parse(raw));
        } catch (_e) {}
      }

      // Sort newest first
      backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return res.json({ backups });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to list backups', details: err.message });
    }
  });

  // 2. Restore file from backup
  app.post('/api/jarvis/backup/restore', async (req: Request, res: Response) => {
    const { backupId } = req.body;
    if (!backupId || typeof backupId !== 'string') {
      return res.status(400).json({ error: 'backupId is required' });
    }

    try {
      await ensureBackupDir();
      const metaPath = path.join(BACKUP_DIR, `${backupId}.json`);
      const backupFilePath = path.join(BACKUP_DIR, `${backupId}.bak`);

      if (!fs.existsSync(metaPath) || !fs.existsSync(backupFilePath)) {
        return res.status(404).json({ error: 'Backup not found or corrupted' });
      }

      const meta = JSON.parse(await fs.promises.readFile(metaPath, 'utf8'));
      const backupContent = await fs.promises.readFile(backupFilePath, 'utf8');

      const targetPath = path.resolve(process.cwd(), meta.originalPath.replace(/^\/+/, ''));

      // Security check
      if (!targetPath.startsWith(process.cwd())) {
        return res.status(403).json({ error: 'Target path outside workspace' });
      }

      await fs.promises.writeFile(targetPath, backupContent, 'utf8');

      return res.json({
        success: true,
        restoredPath: meta.originalPath,
        restoredFromId: backupId,
        message: `Successfully restored ${meta.originalPath} from checkpoint ${backupId}.`,
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Restore failed', details: err.message });
    }
  });

  // 3. Create manual checkpoint
  app.post('/api/jarvis/backup/create', async (req: Request, res: Response) => {
    const { targetPath } = req.body;
    const fileToBackup = targetPath || 'server.ts';

    try {
      await ensureBackupDir();
      const fullPath = path.resolve(process.cwd(), fileToBackup.replace(/^\/+/, ''));

      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: 'Target file not found' });
      }

      const content = await fs.promises.readFile(fullPath, 'utf8');
      const safeName = fileToBackup.replace(/[^a-zA-Z0-9._-]/g, '_');
      const backupId = `bkp_manual_${Date.now()}_${safeName}`;
      const backupFilePath = path.join(BACKUP_DIR, `${backupId}.bak`);
      const metaPath = path.join(BACKUP_DIR, `${backupId}.json`);

      await fs.promises.writeFile(backupFilePath, content, 'utf8');
      await fs.promises.writeFile(
        metaPath,
        JSON.stringify(
          {
            id: backupId,
            originalPath: fileToBackup,
            timestamp: new Date().toISOString(),
            size: Buffer.byteLength(content),
            isManual: true,
          },
          null,
          2
        ),
        'utf8'
      );

      return res.json({
        success: true,
        backupId,
        path: fileToBackup,
        message: `Manual backup checkpoint ${backupId} recorded.`,
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Manual backup creation failed', details: err.message });
    }
  });
}
