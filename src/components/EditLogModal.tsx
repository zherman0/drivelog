import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import {
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Button,
  Alert,
  Grid,
  GridItem,
} from "@patternfly/react-core";
import { useUpdateLog } from "../hooks/useLogs";

interface DrivingLog {
  log_id: number;
  start_time: string;
  end_time: string;
  description: string;
}

interface EditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: DrivingLog | null;
}

export const EditLogModal = ({ isOpen, onClose, log }: EditLogModalProps) => {
  const updateLogMutation = useUpdateLog();
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (log) {
      // Split datetime into date and time
      const [sDate, sTime] = log.start_time.split(" ");
      const [eDate, eTime] = log.end_time.split(" ");
      setStartDate(sDate);
      setStartTime(sTime.substring(0, 5)); // HH:MM format
      setEndDate(eDate);
      setEndTime(eTime.substring(0, 5)); // HH:MM format
      setDescription(log.description);
    }
  }, [log]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!log) return;

    // Combine date and time
    const startDateTime = `${startDate} ${startTime}:00`;
    const endDateTime = `${endDate} ${endTime}:00`;

    // Validate times
    if (new Date(startDateTime) >= new Date(endDateTime)) {
      return;
    }

    updateLogMutation.mutate(
      {
        logId: log.log_id,
        logData: {
          start_time: startDateTime,
          end_time: endDateTime,
          description,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    updateLogMutation.reset();
    onClose();
  };

  return (
    <Modal variant={ModalVariant.medium} isOpen={isOpen} onClose={handleClose}>
      <ModalHeader title="Edit Driving Log" />
      <ModalBody>
        {updateLogMutation.isError && (
          <Alert
            variant="danger"
            title={
              updateLogMutation.error instanceof Error
                ? updateLogMutation.error.message
                : "Failed to update log"
            }
            style={{ marginBottom: "1rem" }}
          />
        )}

        <Form>
          <FormGroup label="Start Date & Time" isRequired>
            <Grid hasGutter>
              <GridItem span={6}>
                <TextInput
                  isRequired
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(_event, value) => setStartDate(value)}
                  placeholder="Start date"
                />
              </GridItem>
              <GridItem span={6}>
                <TextInput
                  isRequired
                  type="time"
                  id="start-time"
                  value={startTime}
                  onChange={(_event, value) => setStartTime(value)}
                  placeholder="Start time"
                />
              </GridItem>
            </Grid>
          </FormGroup>

          <FormGroup label="End Date & Time" isRequired>
            <Grid hasGutter>
              <GridItem span={6}>
                <TextInput
                  isRequired
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(_event, value) => setEndDate(value)}
                  placeholder="End date"
                />
              </GridItem>
              <GridItem span={6}>
                <TextInput
                  isRequired
                  type="time"
                  id="end-time"
                  value={endTime}
                  onChange={(_event, value) => setEndTime(value)}
                  placeholder="End time"
                />
              </GridItem>
            </Grid>
          </FormGroup>

          <FormGroup label="Description" isRequired fieldId="description">
            <TextArea
              isRequired
              id="description"
              value={description}
              onChange={(_event, value) => setDescription(value)}
              placeholder="Describe your driving session..."
              rows={4}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button variant="link" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          isLoading={updateLogMutation.isPending}
          isDisabled={
            updateLogMutation.isPending ||
            !startDate ||
            !startTime ||
            !endDate ||
            !endTime ||
            !description
          }
        >
          Save Changes
        </Button>
      </ModalFooter>
    </Modal>
  );
};
