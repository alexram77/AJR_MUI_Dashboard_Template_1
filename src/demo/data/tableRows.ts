/**
 * Mock table rows for the DataTable showcase.
 *
 * Shaped like a service inventory because it exercises every column type the
 * table supports: text, monospace ids, numbers, a status enum, and a timestamp.
 */
import { daysAgo, hoursAgo } from './timestamps';

export type ServiceGrade = 'healthy' | 'watch' | 'degraded' | 'offline';

export interface ServiceRow {
  id: string;
  name: string;
  region: string;
  grade: ServiceGrade;
  requestsPerMin: number;
  p95Ms: number;
  errorRate: number;
  lastDeploy: string;
}

/** Deploy times are relative so the demo does not go stale overnight. */
export const SERVICE_ROWS: ServiceRow[] = [
  { id: 'svc-01', name: 'ingest-gateway', region: 'us-east-1', grade: 'healthy', requestsPerMin: 18420, p95Ms: 84, errorRate: 0.0011, lastDeploy: hoursAgo(19) },
  { id: 'svc-02', name: 'feature-store', region: 'us-east-1', grade: 'healthy', requestsPerMin: 9310, p95Ms: 122, errorRate: 0.0004, lastDeploy: daysAgo(2) },
  { id: 'svc-03', name: 'scoring-api', region: 'eu-west-1', grade: 'watch', requestsPerMin: 6240, p95Ms: 318, errorRate: 0.0092, lastDeploy: hoursAgo(3) },
  { id: 'svc-04', name: 'batch-runner', region: 'us-west-2', grade: 'healthy', requestsPerMin: 410, p95Ms: 2140, errorRate: 0.0002, lastDeploy: daysAgo(7) },
  { id: 'svc-05', name: 'notify-relay', region: 'eu-west-1', grade: 'degraded', requestsPerMin: 1880, p95Ms: 964, errorRate: 0.0471, lastDeploy: hoursAgo(7) },
  { id: 'svc-06', name: 'archive-writer', region: 'us-west-2', grade: 'healthy', requestsPerMin: 730, p95Ms: 188, errorRate: 0.0000, lastDeploy: daysAgo(13) },
  { id: 'svc-07', name: 'edge-cache', region: 'ap-south-1', grade: 'watch', requestsPerMin: 24100, p95Ms: 41, errorRate: 0.0033, lastDeploy: daysAgo(3) },
  { id: 'svc-08', name: 'legacy-sync', region: 'us-east-1', grade: 'offline', requestsPerMin: 0, p95Ms: 0, errorRate: 0, lastDeploy: daysAgo(89) },
  { id: 'svc-09', name: 'auth-broker', region: 'us-east-1', grade: 'healthy', requestsPerMin: 12050, p95Ms: 66, errorRate: 0.0007, lastDeploy: hoursAgo(17) },
  { id: 'svc-10', name: 'report-builder', region: 'eu-west-1', grade: 'healthy', requestsPerMin: 290, p95Ms: 1420, errorRate: 0.0015, lastDeploy: daysAgo(4) },
];

/** Map a service grade to the tone the status components understand. */
export const GRADE_TONE: Record<ServiceGrade, 'ok' | 'warn' | 'bad' | 'neutral'> = {
  healthy: 'ok',
  watch: 'warn',
  degraded: 'bad',
  offline: 'neutral',
};
