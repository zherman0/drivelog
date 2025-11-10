import {
  Card,
  CardBody,
  Title,
  Badge,
  Spinner,
  Alert,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  Button,
  Flex,
  FlexItem,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import {
  EditIcon,
  TrashIcon,
  MoonIcon,
  SunIcon,
} from "@patternfly/react-icons";
import { formatDateTime, calculateDuration } from "../utils/helpers";
import { useIsMobile } from "../hooks/useMediaQuery";

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

interface DrivingLogsTableProps {
  logs: DrivingLog[];
  stats: {
    total_logs: number;
    total_driving_hours: number;
    daytime_driving_hours: number;
    nighttime_driving_hours: number;
  };
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onEdit: (log: DrivingLog) => void;
  onDelete: (logId: number) => void;
  onAddLog: () => void;
}

export const DrivingLogsTable = ({
  logs,
  stats,
  isLoading,
  isError,
  error,
  onEdit,
  onDelete,
  onAddLog,
}: DrivingLogsTableProps) => {
  const isMobile = useIsMobile();

  return (
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
            {stats.total_logs} {stats.total_logs === 1 ? "session" : "sessions"}
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
              error instanceof Error ? error.message : "Failed to load logs"
            }
          />
        )}

        {!isLoading && !isError && logs.length === 0 && (
          <EmptyState>
            <EmptyStateBody>
              You haven't logged any driving sessions yet. Click "Add Driving
              Log" to get started!
            </EmptyStateBody>
            <EmptyStateActions>
              <Button variant="primary" onClick={onAddLog}>
                Add Your First Log
              </Button>
            </EmptyStateActions>
          </EmptyState>
        )}

        {/* Desktop view: Table */}
        {!isLoading && !isError && logs.length > 0 && !isMobile && (
          <Table aria-label="Driving logs table" variant="compact" isStriped>
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
                  <Td>{calculateDuration(log.start_time, log.end_time)}</Td>
                  <Td>
                    {log.is_nighttime ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <MoonIcon />
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
                        <SunIcon />
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
                          onClick={() => onEdit(log)}
                          aria-label="Edit log"
                        />
                        <Button
                          variant="plain"
                          icon={<TrashIcon />}
                          onClick={() => onDelete(log.log_id)}
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

        {/* Mobile view: Card-based list */}
        {!isLoading && !isError && logs.length > 0 && isMobile && (
          <Stack hasGutter>
            {logs.map((log) => (
              <StackItem key={log.log_id}>
                <Card isCompact>
                  <CardBody>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {log.is_nighttime ? (
                            <>
                              <MoonIcon />
                              <strong>Night Drive</strong>
                            </>
                          ) : (
                            <>
                              <SunIcon />
                              <strong>Day Drive</strong>
                            </>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--pf-v6-global--Color--200)",
                          }}
                        >
                          {calculateDuration(log.start_time, log.end_time)}
                        </div>
                      </div>
                      <Flex spaceItems={{ default: "spaceItemsNone" }}>
                        <FlexItem>
                          <Button
                            variant="plain"
                            icon={<EditIcon />}
                            onClick={() => onEdit(log)}
                            aria-label="Edit log"
                          />
                        </FlexItem>
                        <FlexItem>
                          <Button
                            variant="plain"
                            icon={<TrashIcon />}
                            onClick={() => onDelete(log.log_id)}
                            aria-label="Delete log"
                            isDanger
                          />
                        </FlexItem>
                      </Flex>
                    </div>
                    <div style={{ marginBottom: "0.5rem" }}>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--pf-v6-global--Color--200)",
                        }}
                      >
                        <div>
                          <strong>Start:</strong>{" "}
                          {formatDateTime(log.start_time)}
                        </div>
                        <div>
                          <strong>End:</strong> {formatDateTime(log.end_time)}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        paddingTop: "0.5rem",
                        borderTop:
                          "1px solid var(--pf-v6-global--BorderColor--100)",
                      }}
                    >
                      {log.description}
                    </div>
                  </CardBody>
                </Card>
              </StackItem>
            ))}
          </Stack>
        )}
      </CardBody>
    </Card>
  );
};
