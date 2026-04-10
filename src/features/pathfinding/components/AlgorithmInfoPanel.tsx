import { useState } from 'react';

import { ALGORITHM_EDUCATION } from '../constants/algorithmEducation';

interface AlgorithmInfoProps {
  algorithmId: string;
}

export function AlgorithmInfoPanel({ algorithmId }: AlgorithmInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const edu = ALGORITHM_EDUCATION[algorithmId];

  if (!edu) return null;

  return (
    <div className="rounded-md border border-border bg-surface">
      {/* Header — always visible */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-base font-medium text-text hover:bg-bg"
      >
        <span>算法详解</span>
        <span className="text-sm text-text-muted">{isExpanded ? '▲ 收起' : '▼ 展开'}</span>
      </button>

      {isExpanded && (
        <div className="space-y-5 border-t border-border px-5 py-4">
          {/* Core concept */}
          <div>
            <h3 className="mb-1.5 text-sm font-semibold text-text-muted">核心思想</h3>
            <p className="text-sm leading-relaxed text-text">{edu.coreConcept}</p>
          </div>

          {/* Key terms */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-text-muted">关键概念</h3>
            <dl className="space-y-2">
              {edu.keyTerms.map((kt) => (
                <div key={kt.term} className="rounded-md bg-bg px-4 py-2.5">
                  <dt className="text-sm font-medium text-text">{kt.term}</dt>
                  <dd className="mt-0.5 text-sm leading-relaxed text-text-muted">
                    {kt.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Workflow */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-text-muted">工作流程</h3>
            <ol className="list-inside list-decimal space-y-1.5 text-sm leading-relaxed text-text">
              {edu.workflow.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Characteristics */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-text-muted">特点</h3>
            <div className="grid grid-cols-2 gap-2">
              {edu.characteristics.map((c) => (
                <div key={c.label} className="rounded-md bg-bg px-4 py-2">
                  <span className="text-sm text-text-muted">{c.label}</span>
                  <p className="text-sm font-medium text-text">{c.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Use cases */}
          <div>
            <h3 className="mb-1.5 text-sm font-semibold text-text-muted">适用场景</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-text-muted">
              {edu.useCases.map((uc, i) => (
                <li key={i}>{uc}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
