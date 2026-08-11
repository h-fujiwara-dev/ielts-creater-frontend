"use client";

import { useState } from "react";

import { AuthShell } from "./auth-shell";
import { ConfirmCodeForm } from "./confirm-code-form";
import type { FlowStep } from "./flow-step";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

type LoginSignupFlowProps = {
  initialStep?: FlowStep;
};

export function LoginSignupFlow({ initialStep = "login" }: LoginSignupFlowProps) {
  const [step, setStep] = useState<FlowStep>(initialStep);
  const [pendingEmail, setPendingEmail] = useState("");

  return (
    <AuthShell step={step}>
      {step === "login" && <LoginForm onSwitchToSignup={() => setStep("signup")} />}
      {step === "signup" && (
        <SignupForm
          onSwitchToLogin={() => setStep("login")}
          onSignupSuccess={(email) => {
            setPendingEmail(email);
            setStep("confirmCode");
          }}
        />
      )}
      {step === "confirmCode" && (
        <ConfirmCodeForm email={pendingEmail} onConfirmSuccess={() => setStep("login")} />
      )}
    </AuthShell>
  );
}
