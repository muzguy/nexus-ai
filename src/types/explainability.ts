export interface WhyThisInputContext {
  label: string;
  value: string;
  badge?: string;
}

export interface WhyThisData {
  stageBadge?: string;
  title?: string;
  decision: string;
  decisionSubtitle?: string;
  inputs: WhyThisInputContext[];
  reasoning: string;
  tradeoff?: string;
  consideration?: string;
}

export interface WhyThisProps extends WhyThisData {
  triggerLabel?: string;
  triggerVariant?: 'button' | 'compact' | 'icon';
  className?: string;
  align?: 'left' | 'right' | 'center';
}
