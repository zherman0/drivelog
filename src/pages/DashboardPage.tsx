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
            <GridItem span={12} md={6} lg={3}>
              <Card isFullHeight>
                <CardBody>
                  <Title headingLevel="h3" size="lg">
                    Total Driving Sessions
                  </Title>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      marginTop: "1rem",
                    }}
                  >
                    {stats.total_logs}
                  </div>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem span={12} md={6} lg={3}>
              <Card isFullHeight>
                <CardBody>
                  <Title headingLevel="h3" size="lg">
                    Total Driving Hours
                  </Title>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      marginTop: "1rem",
                    }}
                  >
                    {stats.total_driving_hours}
                  </div>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem span={12} md={6} lg={3}>
              <Card isFullHeight>
                <CardBody>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <SunIcon
                      style={{
                        fontSize: "2.5rem",
                        color: "var(--pf-v6-global--warning-color--100)",
                      }}
                    />
                    <Title headingLevel="h3" size="lg">
                      Day Hours
                    </Title>
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      marginTop: "1rem",
                    }}
                  >
                    {stats.daytime_driving_hours || 0}
                  </div>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem span={12} md={6} lg={3}>
              <Card isFullHeight>
                <CardBody>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <MoonIcon
                      style={{
                        fontSize: "2.5rem",
                        color: "var(--pf-v6-global--info-color--100)",
                      }}
                    />
                    <Title headingLevel="h3" size="lg">
                      Night Hours
                    </Title>
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      marginTop: "1rem",
                    }}
                  >
                    {stats.nighttime_driving_hours || 0}
                  </div>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </PageSection>

        <PageSection>
          <Card>
            <CardBody>
              <Title
                headingLevel="h2"
                size="xl"
                style={{ marginBottom: "1rem" }}
              >
                Driving Logs
              </Title>

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
                        <Td>
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
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </PageSection>
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
