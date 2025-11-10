import {
  PageSection,
  Card,
  CardBody,
  Title,
  Alert,
} from "@patternfly/react-core";
import type { LicenseProgress } from "../utils/helpers";

interface LicenseEligibilityCardProps {
  licenseProgress: LicenseProgress | null;
}

export const LicenseEligibilityCard = ({
  licenseProgress,
}: LicenseEligibilityCardProps) => {
  if (!licenseProgress) {
    return null;
  }

  return (
    <PageSection>
      <Card>
        <CardBody>
          <Title headingLevel="h3" size="lg" style={{ marginBottom: "1rem" }}>
            License Eligibility Progress
          </Title>
          {licenseProgress.isEligible ? (
            <Alert
              variant="success"
              title="You are eligible to get your driver's license now!"
              isInline
            >
              Congratulations! You've reached the minimum age requirement. Keep
              practicing and logging your driving hours!
            </Alert>
          ) : (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div
                style={{
                  fontSize: "4rem",
                  fontWeight: "bold",
                  color: "var(--pf-v6-global--primary-color--100)",
                  lineHeight: "1",
                  marginBottom: "0.5rem",
                }}
              >
                {licenseProgress.daysRemaining}
              </div>
              <div
                style={{
                  fontSize: "1.25rem",
                  color: "var(--pf-v6-global--Color--200)",
                  marginBottom: "0.5rem",
                }}
              >
                Days Until Eligible
              </div>
              <div
                style={{
                  fontSize: "0.95rem",
                  color: "var(--pf-v6-global--Color--200)",
                }}
              >
                Current age: {licenseProgress.age} years old
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </PageSection>
  );
};
