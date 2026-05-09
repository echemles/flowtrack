import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';

export function PlaceholderPage({
  title,
  endpoint,
  description,
}: {
  title: string;
  endpoint: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <SectionHeader title={title} subtitle={description} />
      <Card>
        <div className="text-sm text-text-secondary">
          This surface fetches from{' '}
          <code className="rounded bg-surface-canvas px-1 py-0.5 text-xs">
            {endpoint}
          </code>
          . Surface phase fills in the layout.
        </div>
      </Card>
    </div>
  );
}
