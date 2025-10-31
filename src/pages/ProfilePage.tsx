import { useState } from "react";
import type { FormEvent } from "react";
import {
  Page,
  PageSection,
  Card,
  CardBody,
  Form,
  FormGroup,
  TextInput,
  Button,
  Alert,
  AlertActionCloseButton,
  Title,
  Grid,
  GridItem,
  Spinner,
} from "@patternfly/react-core";
import { useAuth } from "../context/AuthContext";
import { useUpdateUser, useUpdatePassword } from "../hooks/useAuth";
import { AppHeader } from "../components/AppHeader";

export const ProfilePage = () => {
  const { user, setAuthData } = useAuth();
  const updateUserMutation = useUpdateUser();
  const updatePasswordMutation = useUpdatePassword();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [birthdate, setBirthdate] = useState(user?.birthdate || "");
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!user) return;

    updateUserMutation.mutate(
      {
        userId: user.user_id,
        userData: {
          name,
          email,
          birthdate,
        },
      },
      {
        onSuccess: (updatedUser) => {
          // Update the auth context with the new user data
          const token = localStorage.getItem("token");
          if (token) {
            setAuthData(token, updatedUser);
          }
          setIsEditing(false);
          setShowSuccess(true);
          // Hide success message after 3 seconds
          setTimeout(() => setShowSuccess(false), 3000);
        },
      }
    );
  };

  const handleCancel = () => {
    // Reset form to original values
    setName(user?.name || "");
    setEmail(user?.email || "");
    setBirthdate(user?.birthdate || "");
    setIsEditing(false);
    updateUserMutation.reset();
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Validate password match
    if (newPassword !== confirmPassword) {
      return;
    }

    updatePasswordMutation.mutate(
      {
        userId: user.user_id,
        passwordData: {
          current_password: currentPassword,
          new_password: newPassword,
        },
      },
      {
        onSuccess: () => {
          // Clear password fields
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setShowPasswordSuccess(true);
          // Hide success message after 3 seconds
          setTimeout(() => setShowPasswordSuccess(false), 3000);
        },
      }
    );
  };

  if (!user) {
    return (
      <Page>
        <AppHeader />
        <PageSection isFilled>
          <Spinner size="xl" />
        </PageSection>
      </Page>
    );
  }

  return (
    <Page>
      <AppHeader />
      <PageSection>
        <Grid hasGutter>
          <GridItem span={12} md={8} mdOffset={2}>
            <Card>
              <CardBody>
                <Title
                  headingLevel="h1"
                  size="2xl"
                  style={{ marginBottom: "1.5rem" }}
                >
                  My Profile
                </Title>

                {showSuccess && (
                  <Alert
                    variant="success"
                    title="Profile updated successfully!"
                    actionClose={
                      <AlertActionCloseButton
                        onClose={() => setShowSuccess(false)}
                      />
                    }
                    style={{ marginBottom: "1rem" }}
                  />
                )}

                {updateUserMutation.isError && (
                  <Alert
                    variant="danger"
                    title={
                      updateUserMutation.error instanceof Error
                        ? updateUserMutation.error.message
                        : "Failed to update profile"
                    }
                    actionClose={
                      <AlertActionCloseButton
                        onClose={() => updateUserMutation.reset()}
                      />
                    }
                    style={{ marginBottom: "1rem" }}
                  />
                )}

                <Form onSubmit={handleSubmit}>
                  <FormGroup label="Username" fieldId="username">
                    <TextInput
                      type="text"
                      id="username"
                      value={user.username}
                      isDisabled
                      placeholder="Username cannot be changed"
                    />
                  </FormGroup>

                  <FormGroup label="Name" isRequired fieldId="name">
                    <TextInput
                      isRequired
                      type="text"
                      id="name"
                      value={name}
                      onChange={(_event, value) => setName(value)}
                      isDisabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </FormGroup>

                  <FormGroup label="Email" isRequired fieldId="email">
                    <TextInput
                      isRequired
                      type="email"
                      id="email"
                      value={email}
                      onChange={(_event, value) => setEmail(value)}
                      isDisabled={!isEditing}
                      placeholder="Enter your email"
                    />
                  </FormGroup>

                  <FormGroup label="Birthdate" isRequired fieldId="birthdate">
                    <TextInput
                      isRequired
                      type="date"
                      id="birthdate"
                      value={birthdate}
                      onChange={(_event, value) => setBirthdate(value)}
                      isDisabled={!isEditing}
                    />
                  </FormGroup>

                  <FormGroup label="Account Created" fieldId="created">
                    <TextInput
                      type="text"
                      id="created"
                      value={new Date(user.created_at).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                      isDisabled
                    />
                  </FormGroup>

                  {!isEditing ? (
                    <Button
                      variant="primary"
                      onClick={() => setIsEditing(true)}
                      style={{ marginTop: "1rem" }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <div
                      style={{
                        marginTop: "1rem",
                        display: "flex",
                        gap: "1rem",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={updateUserMutation.isPending}
                        isDisabled={
                          updateUserMutation.isPending ||
                          !name ||
                          !email ||
                          !birthdate
                        }
                      >
                        {updateUserMutation.isPending
                          ? "Saving..."
                          : "Save Changes"}
                      </Button>
                      <Button
                        variant="link"
                        onClick={handleCancel}
                        isDisabled={updateUserMutation.isPending}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </Form>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>

      <PageSection>
        <Grid hasGutter>
          <GridItem span={12} md={8} mdOffset={2}>
            <Card>
              <CardBody>
                <Title
                  headingLevel="h2"
                  size="xl"
                  style={{ marginBottom: "1.5rem" }}
                >
                  Change Password
                </Title>

                {showPasswordSuccess && (
                  <Alert
                    variant="success"
                    title="Password updated successfully!"
                    actionClose={
                      <AlertActionCloseButton
                        onClose={() => setShowPasswordSuccess(false)}
                      />
                    }
                    style={{ marginBottom: "1rem" }}
                  />
                )}

                {updatePasswordMutation.isError && (
                  <Alert
                    variant="danger"
                    title={
                      updatePasswordMutation.error instanceof Error
                        ? updatePasswordMutation.error.message
                        : "Failed to update password"
                    }
                    actionClose={
                      <AlertActionCloseButton
                        onClose={() => updatePasswordMutation.reset()}
                      />
                    }
                    style={{ marginBottom: "1rem" }}
                  />
                )}

                <Form onSubmit={handlePasswordSubmit}>
                  <FormGroup
                    label="Current Password"
                    isRequired
                    fieldId="current-password"
                  >
                    <TextInput
                      isRequired
                      type="password"
                      id="current-password"
                      value={currentPassword}
                      onChange={(_event, value) => setCurrentPassword(value)}
                      placeholder="Enter your current password"
                      autoComplete="current-password"
                    />
                  </FormGroup>

                  <FormGroup
                    label="New Password"
                    isRequired
                    fieldId="new-password"
                  >
                    <TextInput
                      isRequired
                      type="password"
                      id="new-password"
                      value={newPassword}
                      onChange={(_event, value) => setNewPassword(value)}
                      placeholder="Enter new password (min 8 characters)"
                      autoComplete="new-password"
                      validated={
                        newPassword && newPassword.length < 8
                          ? "error"
                          : "default"
                      }
                    />
                    {newPassword && newPassword.length < 8 && (
                      <div
                        style={{
                          color: "var(--pf-v6-global--danger-color--100)",
                          fontSize: "0.875rem",
                          marginTop: "0.25rem",
                        }}
                      >
                        Password must be at least 8 characters
                      </div>
                    )}
                  </FormGroup>

                  <FormGroup
                    label="Confirm New Password"
                    isRequired
                    fieldId="confirm-password"
                  >
                    <TextInput
                      isRequired
                      type="password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(_event, value) => setConfirmPassword(value)}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      validated={
                        confirmPassword && newPassword !== confirmPassword
                          ? "error"
                          : "default"
                      }
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <div
                        style={{
                          color: "var(--pf-v6-global--danger-color--100)",
                          fontSize: "0.875rem",
                          marginTop: "0.25rem",
                        }}
                      >
                        Passwords do not match
                      </div>
                    )}
                  </FormGroup>

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={updatePasswordMutation.isPending}
                    isDisabled={
                      updatePasswordMutation.isPending ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword ||
                      newPassword !== confirmPassword ||
                      newPassword.length < 8
                    }
                    style={{ marginTop: "1rem" }}
                  >
                    {updatePasswordMutation.isPending
                      ? "Updating..."
                      : "Update Password"}
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </Page>
  );
};
