'use client';

import React, { useRef } from 'react';
import Resume, { type ResumeData, type ResumeSectionHeadings, type ResumeFallbackLabels, type AdditionalSectionLabels } from '@/components/dashboard/resume-component';
import { type TemplateSettings } from '@/lib/types/template-settings';
import { usePagination } from '@/components/preview/use-pagination';
import { PAGE_DIMENSIONS, mmToPx, getContentAreaPx } from '@/lib/constants/page-dimensions';

interface PaginatedPrintProps {
  resumeData: ResumeData;
  settings: TemplateSettings;
  additionalSectionLabels?: Partial<AdditionalSectionLabels>;
  sectionHeadings?: Partial<ResumeSectionHeadings>;
  fallbackLabels?: Partial<ResumeFallbackLabels>;
}

export function PaginatedPrint({
  resumeData,
  settings,
  additionalSectionLabels,
  sectionHeadings,
  fallbackLabels,
}: PaginatedPrintProps) {
  const measurementRef = useRef<HTMLDivElement>(null);

  const { pages, isCalculating } = usePagination({
    pageSize: settings.pageSize,
    margins: settings.margins,
    measurementRef,
  });

  const isReady = !isCalculating && pages.length > 0;
  const contentArea = getContentAreaPx(settings.pageSize, settings.margins);

  // Resume component needs 0 margins because the page wrapper will have the padding
  const resumeSettings: TemplateSettings = {
    ...settings,
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
  };

  const pageDims = PAGE_DIMENSIONS[settings.pageSize];

  return (
    <div className={`bg-gray-100 ${isReady ? 'resume-print' : ''}`}>
      {/* Hidden measurement container */}
      <div
        ref={measurementRef}
        className="absolute opacity-0 pointer-events-none"
        style={{
          width: contentArea.width,
          left: -9999,
          top: 0,
        }}
        aria-hidden="true"
      >
        <Resume
          resumeData={resumeData}
          template={settings.template}
          settings={resumeSettings}
          additionalSectionLabels={additionalSectionLabels}
          sectionHeadings={sectionHeadings}
          fallbackLabels={fallbackLabels}
        />
      </div>

      {/* Render Pages */}
      <div className="flex flex-col items-center gap-8 py-8">
        {isReady &&
          pages.map((page, index) => {
            const isLastPage = index === pages.length - 1;
            // Limit contentEnd to avoid rendering content that belongs on the next page
            // Except for the last page where we just let it flow
            const maxContentHeight = contentArea.height;
            const actualContentHeight = page.contentEnd
              ? Math.min(maxContentHeight, page.contentEnd - page.contentOffset)
              : maxContentHeight;

            return (
              <div
                key={page.pageNumber}
                className="page bg-white shadow-xl"
                style={{
                  width: `${pageDims.width}mm`,
                  height: `${pageDims.height}mm`,
                  padding: `${settings.margins.top}mm ${settings.margins.right}mm ${settings.margins.bottom}mm ${settings.margins.left}mm`,
                  boxSizing: 'border-box',
                  position: 'relative',
                  margin: 'auto',
                  // Force page breaks when printed natively
                  pageBreakAfter: isLastPage ? 'auto' : 'always',
                  breakAfter: isLastPage ? 'auto' : 'page',
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    height: isLastPage ? '100%' : `${actualContentHeight}px`,
                  }}
                >
                  <div
                    className="absolute left-0 right-0"
                    style={{
                      top: -page.contentOffset,
                    }}
                  >
                    <Resume
                      resumeData={resumeData}
                      template={settings.template}
                      settings={resumeSettings}
                      additionalSectionLabels={additionalSectionLabels}
                      sectionHeadings={sectionHeadings}
                      fallbackLabels={fallbackLabels}
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
