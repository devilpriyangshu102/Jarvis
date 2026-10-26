import {
lstat,
mkdir,
readFile,
rename,
unlink,
writeFile,
} from "node:fs/promises";

import path from "node:path";
import { randomUUID } from "node:crypto";

/**

* JARVIS EVOLUTION CORE
* 
* Responsibilities:
* - Inspect permitted project source files.
* - Create modification proposals.
* - Require explicit approval.
* - Back up original files.
* - Apply approved changes.
* - Maintain an audit log.
* 
* This module must be called from an authenticated backend.
  */

const PROJECT_ROOT = path.resolve(process.cwd());

const BACKUP_ROOT = path.join(
PROJECT_ROOT,
".jarvis-backups"
);

const AUDIT_LOG = path.join(
BACKUP_ROOT,
"audit.jsonl"
);

const MAX_FILE_SIZE = 500_000;

const ALLOWED_EXTENSIONS = new Set([
".ts",
".tsx",
".js",
".jsx",
".css",
".html",
]);

const ALLOWED_DIRECTORIES = [
path.join(PROJECT_ROOT, "src"),
path.join(PROJECT_ROOT, "server"),
];

const BLOCKED_FILES = new Set([
".env",
".env.local",
".env.production",
"server.ts",
]);

export type EvolutionStatus =
| "pending"
| "applied"
| "rejected"
| "failed";

export interface EvolutionProposal {
id: string;
filePath: string;
originalContent: string;
proposedContent: string;
explanation: string;
createdAt: string;
status: EvolutionStatus;
}

const proposals = new Map<
string,
EvolutionProposal

«();»

function resolveAllowedFile(
relativePath: string
): string {
if (
typeof relativePath !== "string" ||
!relativePath ||
path.isAbsolute(relativePath) ||
relativePath.includes("\0")
) {
throw new Error("Invalid source file path.");
}

const absolutePath = path.resolve(
PROJECT_ROOT,
relativePath
);

const insideAllowedDirectory =
ALLOWED_DIRECTORIES.some((directory) => {
const relative = path.relative(
directory,
absolutePath
);

  return (
    relative !== "" &&
    relative !== ".." &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  );
});

if (!insideAllowedDirectory) {
throw new Error(
"The requested file is outside the permitted directories."
);
}

if (
!ALLOWED_EXTENSIONS.has(
path.extname(absolutePath)
) ||
BLOCKED_FILES.has(path.basename(absolutePath))
) {
throw new Error(
"Modification of this file type or filename is blocked."
);
}

return absolutePath;
}

async function verifyRegularFile(
absolutePath: string
): Promise<void> {
const info = await lstat(absolutePath);

if (!info.isFile() || info.isSymbolicLink()) {
throw new Error(
"Only regular source files can be accessed."
);
}

if (info.size > MAX_FILE_SIZE) {
throw new Error(
"The source file exceeds the permitted size."
);
}
}

async function appendAudit(
event: Record<string, unknown>
): Promise<void> {
await mkdir(BACKUP_ROOT, {
recursive: true,
});

await writeFile(
AUDIT_LOG,
JSON.stringify({
timestamp: new Date().toISOString(),
...event,
}) + "\n",
{
encoding: "utf8",
flag: "a",
}
);
}

/**

* Read a permitted source file.
  */
  export async function inspectSource(
  relativePath: string
  ): Promise<{
  filePath: string;
  content: string;
  }> {
  const absolutePath = resolveAllowedFile(
  relativePath
  );

await verifyRegularFile(absolutePath);

const content = await readFile(
absolutePath,
"utf8"
);

return {
filePath: relativePath,
content,
};
}

/**

* Create a proposal without modifying the source.
  */
  export async function proposeEvolution(input: {
  filePath: string;
  proposedContent: string;
  explanation: string;
  }): Promise<{
  id: string;
  filePath: string;
  explanation: string;
  originalContent: string;
  proposedContent: string;
  status: EvolutionStatus;
  }> {
  if (
  typeof input.proposedContent !== "string" ||
  typeof input.explanation !== "string" ||
  input.proposedContent.length > MAX_FILE_SIZE
  ) {
  throw new Error(
  "The proposed modification is invalid or too large."
  );
  }

const absolutePath = resolveAllowedFile(
input.filePath
);

await verifyRegularFile(absolutePath);

const originalContent = await readFile(
absolutePath,
"utf8"
);

const proposal: EvolutionProposal = {
id: randomUUID(),
filePath: input.filePath,
originalContent,
proposedContent: input.proposedContent,
explanation: input.explanation,
createdAt: new Date().toISOString(),
status: "pending",
};

proposals.set(proposal.id, proposal);

await appendAudit({
action: "proposal_created",
proposalId: proposal.id,
filePath: proposal.filePath,
});

return {
id: proposal.id,
filePath: proposal.filePath,
explanation: proposal.explanation,
originalContent: proposal.originalContent,
proposedContent: proposal.proposedContent,
status: proposal.status,
};
}

/**

* Retrieve a proposal for the approval interface.
  */
  export function getEvolutionProposal(
  id: string
  ): EvolutionProposal | undefined {
  const proposal = proposals.get(id);

if (!proposal) {
return undefined;
}

return { ...proposal };
}

/**

* Reject a proposal.
  */
  export async function rejectEvolution(
  id: string
  ): Promise<boolean> {
  const proposal = proposals.get(id);

if (!proposal || proposal.status !== "pending") {
return false;
}

proposal.status = "rejected";

await appendAudit({
action: "proposal_rejected",
proposalId: id,
filePath: proposal.filePath,
});

return true;
}

/**

* Apply a proposal after explicit approval.
* 
* This function does not itself authenticate the caller.
* The backend endpoint calling it must enforce authentication,
* authorization, and approval by the project owner.
  */
  export async function applyEvolution(
  id: string,
  explicitlyApproved: boolean
  ): Promise<{
  success: boolean;
  filePath: string;
  backupPath: string;
  }> {
  if (explicitlyApproved !== true) {
  throw new Error(
  "Explicit approval is required."
  );
  }

const proposal = proposals.get(id);

if (!proposal || proposal.status !== "pending") {
throw new Error(
"The proposal is missing or no longer pending."
);
}

const absolutePath = resolveAllowedFile(
proposal.filePath
);

await verifyRegularFile(absolutePath);

const currentContent = await readFile(
absolutePath,
"utf8"
);

if (currentContent !== proposal.originalContent) {
throw new Error(
"The source has changed. Create a new proposal."
);
}

const backupDirectory = path.join(
BACKUP_ROOT,
new Date().toISOString().replace(/[:.]/g, "-")
);

const backupPath = path.join(
backupDirectory,
proposal.filePath
);

const temporaryPath =
absolutePath + "." + randomUUID() + ".tmp";

await mkdir(path.dirname(backupPath), {
recursive: true,
});

await mkdir(path.dirname(temporaryPath), {
recursive: true,
});

await writeFile(
backupPath,
currentContent,
{
encoding: "utf8",
flag: "wx",
}
);

try {
await writeFile(
temporaryPath,
proposal.proposedContent,
{
encoding: "utf8",
flag: "wx",
}
);

const latestContent = await readFile(
  absolutePath,
  "utf8"
);

if (latestContent !== proposal.originalContent) {
  throw new Error(
    "The source changed during the operation."
  );
}

await rename(
  temporaryPath,
  absolutePath
);

proposal.status = "applied";

await appendAudit({
  action: "proposal_applied",
  proposalId: id,
  filePath: proposal.filePath,
  backupPath: path.relative(
    PROJECT_ROOT,
    backupPath
  ),
});

return {
  success: true,
  filePath: proposal.filePath,
  backupPath: path.relative(
    PROJECT_ROOT,
    backupPath
  ),
};

} catch (error) {
await unlink(temporaryPath).catch(() => {});

proposal.status = "failed";

await appendAudit({
  action: "proposal_failed",
  proposalId: id,
  filePath: proposal.filePath,
  error:
    error instanceof Error
      ? error.message
      : "Unknown error",
});

throw error;

}
}

/**

* Retrieve a proposal's current status.
  */
  export function getEvolutionStatus(
  id: string
  ): EvolutionStatus | "not_found" {
  return proposals.get(id)?.status ?? "not_found";
  }
