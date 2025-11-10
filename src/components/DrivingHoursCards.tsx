import {
  Card,
  CardBody,
  Title,
  Grid,
  GridItem,
  Icon,
  Progress,
  ProgressMeasureLocation,
  ProgressVariant,
} from "@patternfly/react-core";
import { MoonIcon, SunIcon } from "@patternfly/react-icons";
import { useIsMobile } from "../hooks/useMediaQuery";

interface DrivingHoursCardsProps {
  stats: {
    total_driving_hours: number;
    daytime_driving_hours: number;
    nighttime_driving_hours: number;
  };
}

export const DrivingHoursCards = ({ stats }: DrivingHoursCardsProps) => {
  const isMobile = useIsMobile();

  return (
    <Grid hasGutter>
      {/* Mobile-only: Combined hours card */}
      {isMobile && (
        <GridItem span={12}>
          <Card>
            <CardBody style={{ padding: "1rem" }}>
              <Title
                headingLevel="h3"
                size="md"
                style={{ marginBottom: "1rem" }}
              >
                Driving Hours Summary
              </Title>

              {/* Total Hours */}
              <div style={{ marginBottom: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.25rem",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>Total Hours</span>
                  <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {stats.total_driving_hours}
                  </span>
                </div>
              </div>

              {/* Day Hours */}
              <div
                style={{
                  marginBottom: "1rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid var(--pf-v6-global--BorderColor--100)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Icon status="warning">
                    <SunIcon
                      style={{
                        fontSize: "1.25rem",
                        color: "var(--pf-v6-global--warning-color--100)",
                      }}
                    />
                  </Icon>
                  <span style={{ fontWeight: "600" }}>Day Hours</span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                    }}
                  >
                    {stats.daytime_driving_hours || 0} / 40
                  </span>
                </div>
                <Progress
                  value={Math.min(
                    ((stats.daytime_driving_hours || 0) / 40) * 100,
                    100
                  )}
                  measureLocation={ProgressMeasureLocation.top}
                  variant={
                    (stats.daytime_driving_hours || 0) >= 40
                      ? ProgressVariant.success
                      : undefined
                  }
                  size="sm"
                />
              </div>

              {/* Night Hours */}
              <div
                style={{
                  paddingTop: "0.75rem",
                  borderTop: "1px solid var(--pf-v6-global--BorderColor--100)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Icon status="info">
                    <MoonIcon
                      style={{
                        fontSize: "1.25rem",
                        color: "var(--pf-v6-global--info-color--100)",
                      }}
                    />
                  </Icon>
                  <span style={{ fontWeight: "600" }}>Night Hours</span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                    }}
                  >
                    {stats.nighttime_driving_hours || 0} / 10
                  </span>
                </div>
                <Progress
                  value={Math.min(
                    ((stats.nighttime_driving_hours || 0) / 10) * 100,
                    100
                  )}
                  measureLocation={ProgressMeasureLocation.top}
                  variant={
                    (stats.nighttime_driving_hours || 0) >= 10
                      ? ProgressVariant.success
                      : undefined
                  }
                  size="sm"
                />
              </div>
            </CardBody>
          </Card>
        </GridItem>
      )}

      {/* Desktop-only: Separate hour cards (hidden on mobile) */}
      {!isMobile && (
        <>
          <GridItem span={12} md={4} lg={4}>
            <Card isFullHeight>
              <CardBody style={{ padding: "1rem" }}>
                <Title
                  headingLevel="h3"
                  size="md"
                  style={{ marginBottom: "0.5rem" }}
                >
                  Total Driving Hours
                </Title>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "bold",
                  }}
                >
                  {stats.total_driving_hours}
                </div>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={12} md={4} lg={4}>
            <Card isFullHeight>
              <CardBody style={{ padding: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Icon status="warning">
                    <SunIcon
                      style={{
                        fontSize: "1.75rem",
                        color: "var(--pf-v6-global--warning-color--100)",
                      }}
                    />
                  </Icon>
                  <Title headingLevel="h3" size="md">
                    Day Hours
                  </Title>
                </div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                  }}
                >
                  {stats.daytime_driving_hours || 0} / 40
                </div>
                <Progress
                  value={Math.min(
                    ((stats.daytime_driving_hours || 0) / 40) * 100,
                    100
                  )}
                  title="Progress to 40 hours"
                  measureLocation={ProgressMeasureLocation.top}
                  variant={
                    (stats.daytime_driving_hours || 0) >= 40
                      ? ProgressVariant.success
                      : undefined
                  }
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={12} md={4} lg={4}>
            <Card isFullHeight>
              <CardBody style={{ padding: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Icon status="info">
                    <MoonIcon
                      style={{
                        fontSize: "1.75rem",
                        color: "var(--pf-v6-global--info-color--100)",
                      }}
                    />
                  </Icon>
                  <Title headingLevel="h3" size="md">
                    Night Hours
                  </Title>
                </div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                  }}
                >
                  {stats.nighttime_driving_hours || 0} / 10
                </div>
                <Progress
                  value={Math.min(
                    ((stats.nighttime_driving_hours || 0) / 10) * 100,
                    100
                  )}
                  title="Progress to 10 hours"
                  measureLocation={ProgressMeasureLocation.top}
                  variant={
                    (stats.nighttime_driving_hours || 0) >= 10
                      ? ProgressVariant.success
                      : undefined
                  }
                />
              </CardBody>
            </Card>
          </GridItem>
        </>
      )}
    </Grid>
  );
};
