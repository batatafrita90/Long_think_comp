'use client';

import useSWR from 'swr';
import { fetchAggregatedMetrics } from '@/lib/api/metrics-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

type MetricsDashboardProps = {
  fetcher?: typeof fetchAggregatedMetrics;
};

export function MetricsDashboard({ fetcher = fetchAggregatedMetrics }: MetricsDashboardProps = {}) {
  const { data, error, isLoading } = useSWR('metrics:aggregated', () => fetcher(), {
    refreshInterval: 15000,
  });

  if (error) {
    return (
      <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
        Erro ao carregar métricas: {error instanceof Error ? error.message : 'desconhecido'}
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse bg-neutral-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {(data ?? []).map((metric) => (
        <Card key={metric.label}>
          <CardHeader className="space-y-1">
            <CardTitle>{metric.label}</CardTitle>
            {metric.delta != null && (
              <CardDescription>
                Variação nas últimas 24h:{' '}
                <Badge variant={metric.delta >= 0 ? 'success' : 'danger'}>
                  {metric.delta > 0 ? '+' : ''}
                  {metric.delta.toFixed(1)}
                  {metric.unit ?? '%'}
                </Badge>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-semibold text-neutral-900">
              {metric.value.toFixed(2)}
              {metric.unit ?? ''}
            </p>
            <Progress value={Math.min(metric.value, 100)} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
