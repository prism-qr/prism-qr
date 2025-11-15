"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, Code, Book, Key, Link as LinkIcon } from "lucide-react";

export function ApiDocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://dev-api.prismqr.com";

  const handleCopyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <Book className="h-6 w-6 text-purple-400" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                API Documentation
              </h1>
            </div>
            <p className="text-lg text-neutral-400">
              Manage your links programmatically using API keys. Create, update, and delete links from your applications.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-yellow-400" />
              <h2 className="text-xl font-semibold">Authentication</h2>
            </div>
            <p className="text-neutral-400">
              All API requests require authentication using an API key. Include your API key in the request header:
            </p>
            <CodeBlock
              id="auth-header"
              language="bash"
              code={`x-api-key: your-api-key-here`}
              onCopy={handleCopyToClipboard}
              copiedId={copiedId}
            />
            <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
              <p className="text-sm text-blue-400">
                <strong>Note:</strong> You can generate API keys from the dashboard by selecting a link and navigating to the API Keys section.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-green-400" />
              <h2 className="text-2xl font-bold">Endpoints</h2>
            </div>

            <EndpointSection
              method="POST"
              endpoint="/links"
              title="Create Link"
              description="Create a new link with a name and destination URL."
              requestBody={{
                name: "string",
                destination: "string"
              }}
              exampleRequest={`curl -X POST ${apiBaseUrl}/links \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: your-api-key-here" \\
  -d '{
    "name": "my-link",
    "destination": "https://example.com"
  }'`}
              exampleResponse={`{
  "id": "60d5ec49f1b2c72b8c8e4f3a",
  "name": "my-link",
  "destination": "https://example.com",
  "userId": "60d5ec49f1b2c72b8c8e4f3b",
  "createdAt": "2025-11-15T10:30:00.000Z",
  "updatedAt": "2025-11-15T10:30:00.000Z"
}`}
              onCopy={handleCopyToClipboard}
              copiedId={copiedId}
            />

            <EndpointSection
              method="PATCH"
              endpoint="/links/:linkId"
              title="Update Link"
              description="Update the destination URL of an existing link."
              requestBody={{
                destination: "string"
              }}
              exampleRequest={`curl -X PATCH ${apiBaseUrl}/links/60d5ec49f1b2c72b8c8e4f3a \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: your-api-key-here" \\
  -d '{
    "destination": "https://new-destination.com"
  }'`}
              exampleResponse={`{
  "id": "60d5ec49f1b2c72b8c8e4f3a",
  "name": "my-link",
  "destination": "https://new-destination.com",
  "userId": "60d5ec49f1b2c72b8c8e4f3b",
  "createdAt": "2025-11-15T10:30:00.000Z",
  "updatedAt": "2025-11-15T11:45:00.000Z"
}`}
              onCopy={handleCopyToClipboard}
              copiedId={copiedId}
            />

            <EndpointSection
              method="DELETE"
              endpoint="/links/:linkId"
              title="Delete Link"
              description="Delete a link permanently. This action cannot be undone."
              exampleRequest={`curl -X DELETE ${apiBaseUrl}/links/60d5ec49f1b2c72b8c8e4f3a \\
  -H "x-api-key: your-api-key-here"`}
              exampleResponse={`{
  "message": "Link deleted successfully"
}`}
              onCopy={handleCopyToClipboard}
              copiedId={copiedId}
            />
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-purple-400" />
              <h2 className="text-xl font-semibold">Base URL</h2>
            </div>
            <p className="text-neutral-400">
              All API requests should be made to:
            </p>
            <CodeBlock
              id="base-url"
              language="text"
              code={apiBaseUrl}
              onCopy={handleCopyToClipboard}
              copiedId={copiedId}
            />
          </div>

          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-yellow-400">Error Handling</h3>
            <p className="text-neutral-400">
              The API returns standard HTTP status codes:
            </p>
            <ul className="space-y-2 text-neutral-400 list-disc list-inside">
              <li><code className="text-green-400">200</code> - Success</li>
              <li><code className="text-green-400">201</code> - Created</li>
              <li><code className="text-yellow-400">400</code> - Bad Request (invalid parameters)</li>
              <li><code className="text-red-400">401</code> - Unauthorized (invalid API key)</li>
              <li><code className="text-red-400">404</code> - Not Found</li>
              <li><code className="text-red-400">500</code> - Internal Server Error</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
            <h3 className="text-lg font-semibold">Rate Limits</h3>
            <p className="text-neutral-400">
              API key authentication allows for programmatic access to your links. Please use responsibly and avoid excessive requests.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface EndpointSectionProps {
  method: string;
  endpoint: string;
  title: string;
  description: string;
  requestBody?: Record<string, string>;
  exampleRequest: string;
  exampleResponse: string;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}

function EndpointSection({
  method,
  endpoint,
  title,
  description,
  requestBody,
  exampleRequest,
  exampleResponse,
  onCopy,
  copiedId,
}: EndpointSectionProps) {
  const methodColors: Record<string, string> = {
    GET: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    POST: "bg-green-500/20 text-green-400 border-green-500/30",
    PATCH: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 space-y-4"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${methodColors[method]}`}>
            {method}
          </span>
          <code className="text-lg font-mono text-neutral-300">{endpoint}</code>
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-neutral-400">{description}</p>
      </div>

      {requestBody && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide">
            Request Body
          </h4>
          <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
            <pre className="text-sm text-neutral-300 font-mono">
              {JSON.stringify(requestBody, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide">
          Example Request
        </h4>
        <CodeBlock
          id={`request-${endpoint}`}
          language="bash"
          code={exampleRequest}
          onCopy={onCopy}
          copiedId={copiedId}
        />
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide">
          Example Response
        </h4>
        <CodeBlock
          id={`response-${endpoint}`}
          language="json"
          code={exampleResponse}
          onCopy={onCopy}
          copiedId={copiedId}
        />
      </div>
    </motion.div>
  );
}

interface CodeBlockProps {
  id: string;
  language: string;
  code: string;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}

function CodeBlock({ id, language, code, onCopy, copiedId }: CodeBlockProps) {
  return (
    <div className="relative rounded-lg border border-neutral-800 bg-neutral-950 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
        <span className="text-xs text-neutral-500 font-mono">{language}</span>
        <button
          onClick={() => onCopy(code, id)}
          className="p-1.5 rounded hover:bg-neutral-800 transition-colors"
          title="Copy to clipboard"
        >
          {copiedId === id ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-neutral-500" />
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm text-neutral-300 font-mono whitespace-pre">
          {code}
        </pre>
      </div>
    </div>
  );
}
