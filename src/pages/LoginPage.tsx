import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
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
} from "@patternfly/react-core";
import { useAuth } from "../context/AuthContext";
import { useLogin } from "../hooks/useAuth";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuthData, isAuthenticated } = useAuth();
  const loginMutation = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    loginMutation.mutate(
      { username, password },
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

  return (
    <PageSection isFilled>
      <Grid hasGutter>
        <GridItem span={12} md={6} mdOffset={3}>
          <Card>
            <CardBody>
              <Title
                headingLevel="h1"
                size="2xl"
                style={{ marginBottom: "1.5rem" }}
              >
                Login to Drive Log
              </Title>

              {loginMutation.isError && (
                <Alert
                  variant="danger"
                  title={
                    loginMutation.error instanceof Error
                      ? loginMutation.error.message
                      : "Login failed"
                  }
                  actionClose={
                    <AlertActionCloseButton
                      onClose={() => loginMutation.reset()}
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
                    onChange={(_event, value) => setUsername(value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                </FormGroup>

                <FormGroup label="Password" isRequired fieldId="password">
                  <TextInput
                    isRequired
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(_event, value) => setPassword(value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </FormGroup>

                <Button
                  type="submit"
                  variant="primary"
                  isBlock
                  isLoading={loginMutation.isPending}
                  isDisabled={loginMutation.isPending || !username || !password}
                  style={{ marginTop: "1rem" }}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </Form>

              <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <span>Don't have an account? </span>
                <Link
                  to="/register"
                  style={{ color: "var(--pf-v6-global--primary-color--100)" }}
                >
                  Sign up
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
  );
};
