/**
 * 404 — rendered inside the shell so the user keeps their navigation.
 */
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@kit/components/page';
import { EmptyState } from '@kit/components/feedback';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <EmptyState
        title="Page not found"
        description="That route is not part of the demo. Pick a block group from the sidebar."
        action={
          <Button variant="contained" size="small" onClick={() => navigate('/overview')}>
            Back to overview
          </Button>
        }
      />
    </PageContainer>
  );
}
