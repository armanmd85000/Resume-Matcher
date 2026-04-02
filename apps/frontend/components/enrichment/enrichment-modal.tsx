'use client';

import { useEffect, useRef } from 'react';
import { XIcon, Sparkles } from 'lucide-react';
import { useEnrichmentWizard } from '@/hooks/use-enrichment-wizard';
import { useTranslations } from '@/lib/i18n';
import {
  AnalyzingStep,
  GeneratingStep,
  ApplyingStep,
  CompleteStep,
  NoImprovementsStep,
  ErrorStep,
} from './loading-steps';
import { PreviewStep } from './preview-step';
import { ManualAIDialog } from '@/components/ui/manual-ai-dialog';
import { useState } from 'react';

interface EnrichmentModalProps {
  resumeId: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function EnrichmentModal({ resumeId, isOpen, onClose, onComplete }: EnrichmentModalProps) {
  const { t } = useTranslations();

  // In manual mode, we immediately show the ManualAIDialog when isOpen is true.
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [manualIsSubmitting, setManualIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowManualDialog(true);
    } else {
      setShowManualDialog(false);
    }
  }, [isOpen]);

  const handleManualSubmit = (jsonString: string) => {
    setManualIsSubmitting(true);
    const runUpdate = async () => {
      try {
        const parsedJson = JSON.parse(jsonString);
        await fetch('/api/v1/enrichment/manual-parse-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resume_id: resumeId,
            parsed_json: parsedJson,
          }),
        });
        setShowManualDialog(false);
        onComplete();
      } catch (err) {
        console.error(err);
        alert('Invalid JSON or error applying manual enrichment.');
      } finally {
        setManualIsSubmitting(false);
      }
    };
    runUpdate();
  };

  const manualPromptText = `Please enrich the provided resume JSON by improving the work experience descriptions and personal project descriptions. Make them more impactful and metric-driven. Return the entirely valid updated JSON object with NO markdown tags.`;
  const expectedFormatStr = `(Use the exact same JSON schema as the original parsed resume)`;

  if (!isOpen) return null;

  return (
    <ManualAIDialog
      open={showManualDialog}
      onOpenChange={(open) => {
        setShowManualDialog(open);
        if (!open) onClose();
      }}
      title="Enrich Resume"
      instructions="Copy the prompt and paste it into your AI along with your master resume JSON. The AI will rewrite your bullets. Paste the fully updated JSON here."
      promptText={manualPromptText}
      expectedFormat={expectedFormatStr}
      onSubmit={handleManualSubmit}
      isSubmitting={manualIsSubmitting}
    />
  );
}
