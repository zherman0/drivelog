import { useState } from "react";
import {
  PageSection,
  Title,
  Button,
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { useAuth } from "../context/AuthContext";
import { useGetLogs, useDeleteLog } from "../hooks/useLogs";
import { AddLogModal } from "../components/AddLogModal";
import { EditLogModal } from "../components/EditLogModal";
import { LicenseEligibilityCard } from "../components/LicenseEligibilityCard";
import { DrivingLogsTable } from "../components/DrivingLogsTable";
import { DrivingHoursCards } from "../components/DrivingHoursCards";
import { calculateLicenseProgress } from "../utils/helpers";

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

  const licenseProgress = calculateLicenseProgress(user?.birthdate);

  return (
    <>
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

        <DrivingHoursCards stats={stats} />
      </PageSection>

      <PageSection>
        <DrivingLogsTable
          logs={logs}
          stats={stats}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onAddLog={() => setIsAddModalOpen(true)}
        />
      </PageSection>

      <LicenseEligibilityCard licenseProgress={licenseProgress} />

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
