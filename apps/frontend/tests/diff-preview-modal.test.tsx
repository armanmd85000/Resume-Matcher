import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi, describe } from 'vitest';
import { DiffPreviewModal } from '@/components/tailor/diff-preview-modal';
import type { ResumeDiffSummary, ResumeFieldDiff } from '@/lib/api/resume';

vi.mock('@/lib/i18n', () => ({
  useTranslations: () => ({
    t: (key: string) => key,
  }),
}));

const mockSummary: ResumeDiffSummary = {
  added: 1,
  modified: 1,
  removed: 0,
  highRisk: 1,
  totalChanges: 2,
};

const mockChanges: ResumeFieldDiff[] = [
  {
    fieldPath: 'summary',
    changeType: 'modified',
    originalValue: 'Old summary',
    newValue: 'New summary',
    riskLevel: 'low',
    reason: 'Better wording',
  },
  {
    fieldPath: 'skills',
    changeType: 'added',
    originalValue: null,
    newValue: 'React',
    riskLevel: 'high',
    reason: 'Missing skill',
  },
];

describe('DiffPreviewModal', () => {
  test('renders fallback dialog when diff data is missing', () => {
    render(
      <DiffPreviewModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        summary={undefined}
        changes={undefined}
      />
    );
    expect(screen.getByText('tailor.diffModal.fallbackTitle')).toBeInTheDocument();
  });

  test('shows warning banner and renders high-risk icon only for added high changes', () => {
    const { container } = render(
      <DiffPreviewModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        summary={mockSummary}
        changes={mockChanges}
      />
    );
    expect(screen.getByText('tailor.diffModal.warningTitle', { exact: false })).toBeInTheDocument();

    // There should be 2 alert icons: one in the warning banner, one in the high-risk change item
    const alertIcons = container.querySelectorAll('.lucide-triangle-alert');
    expect(alertIcons.length).toBe(2);
  });

  test('toggles section visibility on header click', () => {
    render(
      <DiffPreviewModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        summary={mockSummary}
        changes={mockChanges}
      />
    );

    const modifiedHeader = screen.getByText(/tailor.diffModal.modified/);
    fireEvent.click(modifiedHeader);

    // "New summary" should not be visible after collapse
    expect(screen.queryByText('New summary')).not.toBeInTheDocument();
  });

  test('fires confirm and reject handlers', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    render(
      <DiffPreviewModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        summary={mockSummary}
        changes={mockChanges}
      />
    );

    fireEvent.click(screen.getByText('tailor.diffModal.applyChanges'));
    expect(onConfirm).toHaveBeenCalled();

    fireEvent.click(screen.getByText('tailor.diffModal.rejectChanges'));
    expect(onClose).toHaveBeenCalled();
  });
});
