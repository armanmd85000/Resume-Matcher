import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopyIcon, CheckCircle2Icon, AlertCircleIcon, ExternalLinkIcon } from 'lucide-react';

interface ManualAIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  instructions: string;
  promptText: string;
  expectedFormat: string;
  onSubmit: (result: string) => void;
  isSubmitting?: boolean;
}

export function ManualAIDialog({
  open,
  onOpenChange,
  title,
  instructions,
  promptText,
  expectedFormat,
  onSubmit,
  isSubmitting = false,
}: ManualAIDialogProps) {
  const [pastedContent, setPastedContent] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState(false);

  const handleCopy = async (text: string, setCopied: (val: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSubmit = () => {
    if (pastedContent.trim()) {
      onSubmit(pastedContent);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-[#F0F0E8] border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] p-0 gap-0 rounded-none flex flex-col">
        <DialogHeader className="p-6 border-b border-black bg-white shrink-0">
          <DialogTitle className="font-serif text-2xl font-bold tracking-tight">
            Manual AI Mode: {title}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Instructions */}
          <div className="bg-white border border-black p-4 text-sm font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
            <h4 className="font-bold mb-2">Instructions:</h4>
            <p className="whitespace-pre-wrap">{instructions}</p>
          </div>

          {/* Prompt Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold font-mono text-sm uppercase">1. Copy this Prompt:</h4>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-none border-black hover:bg-black hover:text-white"
                onClick={() => handleCopy(promptText, setCopiedPrompt)}
              >
                {copiedPrompt ? (
                  <CheckCircle2Icon className="w-4 h-4 mr-2" />
                ) : (
                  <CopyIcon className="w-4 h-4 mr-2" />
                )}
                {copiedPrompt ? 'Copied!' : 'Copy Prompt'}
              </Button>
            </div>
            <div className="bg-black text-white p-4 font-mono text-xs overflow-x-auto max-h-40 overflow-y-auto shadow-inner whitespace-pre-wrap">
              {promptText}
            </div>
          </div>

          {/* Expected Format Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold font-mono text-sm uppercase">2. Expected Format Reference:</h4>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-none border-black hover:bg-black hover:text-white"
                onClick={() => handleCopy(expectedFormat, setCopiedFormat)}
              >
                {copiedFormat ? (
                  <CheckCircle2Icon className="w-4 h-4 mr-2" />
                ) : (
                  <CopyIcon className="w-4 h-4 mr-2" />
                )}
                {copiedFormat ? 'Copied!' : 'Copy Format'}
              </Button>
            </div>
            <div className="bg-gray-100 border border-black p-4 font-mono text-xs overflow-x-auto max-h-40 overflow-y-auto whitespace-pre-wrap">
              {expectedFormat}
            </div>
          </div>

          {/* Action Step */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm font-mono">
            <ExternalLinkIcon className="w-5 h-5 shrink-0" />
            <p>Now, go to ChatGPT, Claude, or Gemini, paste the prompt, and wait for the response.</p>
          </div>

          {/* Input Section */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold font-mono text-sm uppercase">3. Paste AI Response Here:</h4>
            <Textarea
              className="min-h-[200px] font-mono text-sm border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] focus-visible:ring-0 focus-visible:ring-offset-0 p-4"
              placeholder="Paste the JSON response from your AI here..."
              value={pastedContent}
              onChange={(e) => setPastedContent(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6 border-t border-black bg-white flex justify-end gap-3 shrink-0">
          <Button
            variant="outline"
            className="rounded-none border-black hover:bg-gray-100"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="rounded-none border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all"
            onClick={handleSubmit}
            disabled={!pastedContent.trim() || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Submit AI Output'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
