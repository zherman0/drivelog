import {
  Page,
  PageSection,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateActions,
  Title,
} from "@patternfly/react-core";
import { CarIcon } from "@patternfly/react-icons";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <PageSection isFilled>
        <EmptyState variant="full">
          <CarIcon style={{ marginBottom: "1rem", fontSize: "4rem" }} />
          <Title headingLevel="h1" size="lg">
            Drive Log
          </Title>
          <EmptyStateBody>
            Track your driving practice hours and progress toward your license.
            Perfect for student drivers and their parents to monitor practice
            sessions.
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </EmptyStateActions>
            <EmptyStateActions>
              <Button variant="link" onClick={() => navigate("/register")}>
                Don't have an account? Sign up
              </Button>
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      </PageSection>
    </Page>
  );
};
