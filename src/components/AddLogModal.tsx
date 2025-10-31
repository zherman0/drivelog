import { useState } from "react";
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
  Checkbox,
} from "@patternfly/react-core";
import { useCreateLog } from "../hooks/useLogs";

interface AddLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLogModal = ({ isOpen, onClose }: AddLogModalProps) => {
  const createLogMutation = useCreateLog();

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(getTodayDate());
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState(getTodayDate());
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [isNighttime, setIsNighttime] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Combine date and time
    const startDateTime = `${startDate} ${startTime}:00`;
    const endDateTime = `${endDate} ${endTime}:00`;

    // Validate times
    if (new Date(startDateTime) >= new Date(endDateTime)) {
      return;
    }

    createLogMutation.mutate(
      {
        start_time: startDateTime,
        end_time: endDateTime,
        description,
        is_nighttime: isNighttime,
      },
      {
        onSuccess: () => {
          // Reset form and close modal
          setStartDate(getTodayDate());
          setStartTime("");
          setEndDate(getTodayDate());
          setEndTime("");
          setDescription("");
          setIsNighttime(false);
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    setStartDate(getTodayDate());
    setStartTime("");
    setEndDate(getTodayDate());
    setEndTime("");
    setDescription("");
    setIsNighttime(false);
    createLogMutation.reset();
    onClose();
  };

  return (
    <Modal variant={ModalVariant.medium} isOpen={isOpen} onClose={handleClose}>
      <ModalHeader title="Add Driving Log" />
      <ModalBody>
        {createLogMutation.isError && (
          <Alert
            variant="danger"
            title={
              createLogMutation.error instanceof Error
                ? createLogMutation.error.message
                : "Failed to create log"
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

          <FormGroup fieldId="nighttime">
            <Checkbox
              id="nighttime"
              label="This was nighttime driving"
              isChecked={isNighttime}
              onChange={(_event, checked) => setIsNighttime(checked)}
            />
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
          isLoading={createLogMutation.isPending}
          isDisabled={
            createLogMutation.isPending ||
            !startDate ||
            !startTime ||
            !endDate ||
            !endTime ||
            !description
          }
        >
          Add Log
        </Button>
      </ModalFooter>
    </Modal>
  );
};
