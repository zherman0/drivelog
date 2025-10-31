import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  FormHelperText,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { useAuth } from "../context/AuthContext";
import { useRegister } from "../hooks/useAuth";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  const registerMutation = useRegister();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    birthdate: "",
  });

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      birthdate: "",
    };

    let isValid = true;

    // Username validation
    if (!username) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Name validation
    if (!name) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Birthdate validation
    if (!birthdate) {
      newErrors.birthdate = "Birthdate is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    registerMutation.mutate(
      {
        username,
        email,
        password,
        name,
        birthdate,
      },
      {
        onSuccess: (data) => {
          if (data.success && data.data) {
            const { token, user } = data.data;
            setAuthData(token, user);
            navigate("/dashboard");
          }
        },
      }
    );
  };

  const isFormValid =
    username && email && password && confirmPassword && name && birthdate;

  return (
    <Page>
      <PageSection isFilled>
        <Grid hasGutter>
          <GridItem span={12} md={8} mdOffset={2} lg={6} lgOffset={3}>
            <Card>
              <CardBody>
                <Title
                  headingLevel="h1"
                  size="2xl"
                  style={{ marginBottom: "1.5rem" }}
                >
                  Create Your Account
                </Title>

                {registerMutation.isError && (
                  <Alert
                    variant="danger"
                    title={
                      registerMutation.error instanceof Error
                        ? registerMutation.error.message
                        : "Registration failed"
                    }
                    actionClose={
                      <AlertActionCloseButton
                        onClose={() => registerMutation.reset()}
                      />
                    }
                    style={{ marginBottom: "1rem" }}
                  />
                )}

                <Form onSubmit={handleSubmit}>
                  <FormGroup label="Username" isRequired fieldId="username">
                    <TextInput
                      isRequired
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={(_event, value) => {
                        setUsername(value);
                        if (errors.username)
                          setErrors({ ...errors, username: "" });
                      }}
                      validated={errors.username ? "error" : "default"}
                      placeholder="Choose a username"
                      autoComplete="username"
                    />
                    {errors.username && (
                      <FormHelperText>
                        <HelperText>
                          <HelperTextItem
                            variant="error"
                            icon={<ExclamationCircleIcon />}
                          >
                            {errors.username}
                          </HelperTextItem>
                        </HelperText>
                      </FormHelperText>
                    )}
                  </FormGroup>

                  <FormGroup label="Email" isRequired fieldId="email">
                    <TextInput
                      isRequired
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(_event, value) => {
                        setEmail(value);
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      validated={errors.email ? "error" : "default"}
                      placeholder="your.email@example.com"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <FormHelperText>
                        <HelperText>
                          <HelperTextItem
                            variant="error"
                            icon={<ExclamationCircleIcon />}
                          >
                            {errors.email}
                          </HelperTextItem>
                        </HelperText>
                      </FormHelperText>
                    )}
                  </FormGroup>

                  <FormGroup label="Full Name" isRequired fieldId="name">
                    <TextInput
                      isRequired
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(_event, value) => {
                        setName(value);
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      validated={errors.name ? "error" : "default"}
                      placeholder="John Doe"
                      autoComplete="name"
                    />
                    {errors.name && (
                      <FormHelperText>
                        <HelperText>
                          <HelperTextItem
                            variant="error"
                            icon={<ExclamationCircleIcon />}
                          >
                            {errors.name}
                          </HelperTextItem>
                        </HelperText>
                      </FormHelperText>
                    )}
                  </FormGroup>

                  <FormGroup label="Birthdate" isRequired fieldId="birthdate">
                    <TextInput
                      isRequired
                      type="date"
                      id="birthdate"
                      name="birthdate"
                      value={birthdate}
                      onChange={(_event, value) => {
                        setBirthdate(value);
                        if (errors.birthdate)
                          setErrors({ ...errors, birthdate: "" });
                      }}
                      validated={errors.birthdate ? "error" : "default"}
                      autoComplete="bday"
                    />
                    {errors.birthdate && (
                      <FormHelperText>
                        <HelperText>
                          <HelperTextItem
                            variant="error"
                            icon={<ExclamationCircleIcon />}
                          >
                            {errors.birthdate}
                          </HelperTextItem>
                        </HelperText>
                      </FormHelperText>
                    )}
                  </FormGroup>

                  <FormGroup label="Password" isRequired fieldId="password">
                    <TextInput
                      isRequired
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(_event, value) => {
                        setPassword(value);
                        if (errors.password)
                          setErrors({ ...errors, password: "" });
                      }}
                      validated={errors.password ? "error" : "default"}
                      placeholder="Enter a secure password"
                      autoComplete="new-password"
                    />
                    {errors.password ? (
                      <FormHelperText>
                        <HelperText>
                          <HelperTextItem
                            variant="error"
                            icon={<ExclamationCircleIcon />}
                          >
                            {errors.password}
                          </HelperTextItem>
                        </HelperText>
                      </FormHelperText>
                    ) : (
                      <FormHelperText>
                        <HelperText>
                          <HelperTextItem>Minimum 8 characters</HelperTextItem>
                        </HelperText>
                      </FormHelperText>
                    )}
                  </FormGroup>

                  <FormGroup
                    label="Confirm Password"
                    isRequired
                    fieldId="confirmPassword"
                  >
                    <TextInput
                      isRequired
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(_event, value) => {
                        setConfirmPassword(value);
                        if (errors.confirmPassword)
                          setErrors({ ...errors, confirmPassword: "" });
                      }}
                      validated={errors.confirmPassword ? "error" : "default"}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                      <FormHelperText>
                        <HelperText>
                          <HelperTextItem
                            variant="error"
                            icon={<ExclamationCircleIcon />}
                          >
                            {errors.confirmPassword}
                          </HelperTextItem>
                        </HelperText>
                      </FormHelperText>
                    )}
                  </FormGroup>

                  <Button
                    type="submit"
                    variant="primary"
                    isBlock
                    isLoading={registerMutation.isPending}
                    isDisabled={registerMutation.isPending || !isFormValid}
                    style={{ marginTop: "1.5rem" }}
                  >
                    {registerMutation.isPending
                      ? "Creating account..."
                      : "Sign Up"}
                  </Button>
                </Form>

                <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                  <span>Already have an account? </span>
                  <Link
                    to="/login"
                    style={{ color: "var(--pf-v6-global--primary-color--100)" }}
                  >
                    Login
                  </Link>
                </div>

                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <Link
                    to="/"
                    style={{ color: "var(--pf-v6-global--link--Color)" }}
                  >
                    ← Back to home
                  </Link>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </Page>
  );
};
