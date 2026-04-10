import type { AlgorithmStep } from '../types/grid';

interface StepExplainerProps {
  step: AlgorithmStep | null;
  stepIndex: number;
  totalSteps: number;
  algorithmId: string;
}

/** Real-time explanation of what the algorithm is doing at the current step. */
export function StepExplainer({ step, stepIndex, totalSteps }: StepExplainerProps) {
  if (!step) {
    return (
      <div className="text-xs text-text-muted">
        点击 ▶ 运行算法，这里将实时解释每一步的操作。
      </div>
    );
  }

  // Use the pre-computed description from the algorithm if available
  if (step.description) {
    return (
      <div className="text-xs leading-relaxed text-text">
        <span className="mr-1.5 font-mono text-text-muted">
          [{stepIndex + 1}/{totalSteps}]
        </span>
        {step.description}
      </div>
    );
  }

  // Fallback: generate a generic description
  const pos = `(${step.current.row}, ${step.current.col})`;
  const isFinal = !!step.finalPath;

  let text: string;
  if (isFinal) {
    text = `到达终点 ${pos}！找到路径，长度为 ${step.finalPath!.length} 步。`;
  } else {
    text = `正在评估节点 ${pos}。Open Set 中有 ${step.openSet.length} 个待探索节点，已访问 ${step.closedSet.length} 个节点。`;
  }

  return (
    <div className="text-xs leading-relaxed text-text">
      <span className="mr-1.5 font-mono text-text-muted">
        [{stepIndex + 1}/{totalSteps}]
      </span>
      {text}
    </div>
  );
}
