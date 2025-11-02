import { useState } from "react";
import {
  Page,
  PageSection,
  Title,
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  Spinner,
  Alert,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Icon,
  Flex,
  FlexItem,
  Progress,
  ProgressMeasureLocation,
  ProgressVariant,
  Badge,
} from "@patternfly/react-core";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import {
  PlusCircleIcon,
  EditIcon,
  TrashIcon,
  MoonIcon,
  SunIcon,
} from "@patternfly/react-icons";
import { useAuth } from "../context/AuthContext";
import { useGetLogs, useDeleteLog } from "../hooks/useLogs";
import { useIsMobile } from "../hooks/useMediaQuery";
import { AppHeader } from "../components/AppHeader";
import { AddLogModal } from "../components/AddLogModal";
import { EditLogModal } from "../components/EditLogModal";

interface DrivingLog {
  log_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  description: string;
  is_nighttime: boolean;
  created_at: string;
  updated_at: string;
}

export const DashboardPage = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useGetLogs();
  const deleteLogMutation = useDeleteLog();
  const isMobile = useIsMobile();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<DrivingLog | null>(null);
  const [deleteLogId, setDeleteLogId] = useState<number | null>(null);

  const logs: DrivingLog[] = data?.logs || [];
  const stats = data?.stats || {
    total_logs: 0,
    total_driving_hours: 0,
    daytime_driving_hours: 0,
    nighttime_driving_hours: 0,
  };

  const handleEdit = (log: DrivingLog) => {
    setSelectedLog(log);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (logId: number) => {
    setDeleteLogId(logId);
  };

  const confirmDelete = () => {
    if (deleteLogId) {
      deleteLogMutation.mutate(deleteLogId, {
        onSuccess: () => {
          setDeleteLogId(null);
        },
      });
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Calculate days until user turns 16
  const calculateLicenseProgress = () => {
    if (!user?.birthdate) {
      return null;
    }

    const today = new Date();
    const birthDate = new Date(user.birthdate);

    // Calculate 16th birthday
    const sixteenthBirthday = new Date(birthDate);
    sixteenthBirthday.setFullYear(birthDate.getFullYear() + 16);

    // Calculate age in years
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // If already 16 or older
    if (age >= 16) {
      return {
        isEligible: true,
        daysRemaining: 0,
        age,
      };
    }

    // Calculate days remaining until 16th birthday
    const diffTime = sixteenthBirthday.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      isEligible: false,
      daysRemaining,
      age,
    };
  };

  const licenseProgress = calculateLicenseProgress();

  return (
    <>
      <Page>
        <AppHeader />
        <PageSection>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <Title headingLevel="h1" size="2xl">
              Welcome, {user?.name}!
            </Title>
            <Button
              variant="primary"
              icon={<PlusCircleIcon />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Driving Log
            </Button>
          </div>

          {/* Statistics Cards */}
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
                        <span
                          style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                        >
                          {stats.total_driving_hours}
                        </span>
                      </div>
                    </div>

                    {/* Day Hours */}
                    <div
                      style={{
                        marginBottom: "1rem",
                        paddingTop: "0.75rem",
                        borderTop:
                          "1px solid var(--pf-v6-global--BorderColor--100)",
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
                        borderTop:
                          "1px solid var(--pf-v6-global--BorderColor--100)",
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
        </PageSection>

        <PageSection>
          <Card>
            <CardBody>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <Title headingLevel="h2" size="xl">
                  Driving Logs
                </Title>
                <Badge isRead>
                  {stats.total_logs}{" "}
                  {stats.total_logs === 1 ? "session" : "sessions"}
                </Badge>
              </div>

              {isLoading && (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <Spinner size="xl" />
                </div>
              )}

              {isError && (
                <Alert
                  variant="danger"
                  title={
                    error instanceof Error
                      ? error.message
                      : "Failed to load logs"
                  }
                />
              )}

              {!isLoading && !isError && logs.length === 0 && (
                <EmptyState>
                  <EmptyStateBody>
                    You haven't logged any driving sessions yet. Click "Add
                    Driving Log" to get started!
                  </EmptyStateBody>
                  <EmptyStateActions>
                    <Button
                      variant="primary"
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      Add Your First Log
                    </Button>
                  </EmptyStateActions>
                </EmptyState>
              )}

              {!isLoading && !isError && logs.length > 0 && (
                <Table aria-label="Driving logs table" variant="compact">
                  <Thead>
                    <Tr>
                      <Th>Start Time</Th>
                      <Th>End Time</Th>
                      <Th>Duration</Th>
                      <Th>Type</Th>
                      <Th>Description</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {logs.map((log) => (
                      <Tr key={log.log_id}>
                        <Td>{formatDateTime(log.start_time)}</Td>
                        <Td>{formatDateTime(log.end_time)}</Td>
                        <Td>
                          {calculateDuration(log.start_time, log.end_time)}
                        </Td>
                        <Td>
                          {log.is_nighttime ? (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <MoonIcon
                                style={{
                                  color: "var(--pf-v6-global--info-color--100)",
                                }}
                              />
                              Night
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <SunIcon
                                style={{
                                  color:
                                    "var(--pf-v6-global--warning-color--100)",
                                }}
                              />
                              Day
                            </span>
                          )}
                        </Td>
                        <Td>{log.description}</Td>
                        <Td isActionCell>
                          <Flex>
                            <FlexItem style={{ display: "flex" }}>
                              <Button
                                variant="plain"
                                icon={<EditIcon />}
                                onClick={() => handleEdit(log)}
                                aria-label="Edit log"
                              />
                              <Button
                                variant="plain"
                                icon={<TrashIcon />}
                                onClick={() => handleDeleteClick(log.log_id)}
                                aria-label="Delete log"
                                isDanger
                              />
                            </FlexItem>
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </PageSection>

        {/* License Eligibility Progress - Moved to bottom */}
        {licenseProgress && (
          <PageSection>
            <Card>
              <CardBody>
                <Title
                  headingLevel="h3"
                  size="lg"
                  style={{ marginBottom: "1rem" }}
                >
                  License Eligibility Progress
                </Title>
                {licenseProgress.isEligible ? (
                  <Alert
                    variant="success"
                    title="You are eligible to get your driver's license now!"
                    isInline
                  >
                    Congratulations! You've reached the minimum age requirement.
                    Keep practicing and logging your driving hours!
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
        )}
      </Page>

      <AddLogModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditLogModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLog(null);
        }}
        log={selectedLog}
      />

      <Modal
        variant={ModalVariant.small}
        isOpen={deleteLogId !== null}
        onClose={() => setDeleteLogId(null)}
      >
        <ModalHeader title="Delete Driving Log" />
        <ModalBody>
          Are you sure you want to delete this driving log? This action cannot
          be undone.
        </ModalBody>
        <ModalFooter>
          <Button variant="link" onClick={() => setDeleteLogId(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            isLoading={deleteLogMutation.isPending}
          >
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
