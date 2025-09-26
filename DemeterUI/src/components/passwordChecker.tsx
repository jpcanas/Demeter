import { useState } from "react";
import { Input } from "./ui/input";

export default function PasswordChecker() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl">Password with strength checker</h1>
      <PasswordCheckerMain />
    </div>
  );
}

function PasswordCheckerMain() {
  const [password, setPassword] = useState("");
  const strength = checkPasswordStrength(password);

  return (
    <div className="max-w-md">
      <PasswordInput value={password} onChange={setPassword} />
      <StrengthIndicator strength={strength} password={password} />
      <RequirementsList password={password} />
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded border p-2"
      placeholder="Enter password"
    />
  );
}

function StrengthIndicator({
  strength,
  password,
}: {
  strength: PasswordStrength;
  password: string;
}) {
  const colors = {
    weak: "bg-red-500",
    medium: "bg-yellow-500",
    strong: "bg-green-500",
  };

  return password.length > 0 ? (
    <div className="mt-2">
      <div className="h-2 w-full rounded">
        <div
          className={`h-full rounded transition-all duration-300 ${colors[strength]}`}
          style={{ width: getStrengthPercentage(strength) }}
        />
      </div>
      <p className="mt-1 text-sm capitalize">{strength} password</p>
    </div>
  ) : (
    <></>
  );
}

function RequirementsList({ password }: { password: string }) {
  const requirements = [
    {
      label: "At least 8 characters",
      met: hasMinimumLength(password),
    },
    {
      label: "Contains numbers",
      met: hasNumbers(password),
    },
    {
      label: "Contains special characters",
      met: hasSpecialCharacters(password),
    },
    {
      label: "Contains uppercase and lowercase",
      met: hasMixedCase(password),
    },
  ];

  return (
    <ul className="mt-4 space-y-1">
      {requirements.map(({ label, met }) => (
        <RequirementItem key={label} label={label} met={met} />
      ))}
    </ul>
  );
}

function RequirementItem({ label, met }: { label: string; met: boolean }) {
  return (
    <li
      className={`flex items-center gap-2 text-sm ${
        met ? "text-green-600" : "text-foreground"
      }`}
    >
      {met ? "✓" : "Ο"} {label}
    </li>
  );
}

// utility functions
function hasMinimumLength(password: string): boolean {
  return password.length >= 8;
}

function hasNumbers(password: string): boolean {
  return /\d/.test(password);
}

function hasSpecialCharacters(password: string): boolean {
  return /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

function hasMixedCase(password: string): boolean {
  return /[a-z]/.test(password) && /[A-Z]/.test(password);
}

//Types and evaluation functions
type PasswordStrength = "weak" | "medium" | "strong";

function checkPasswordStrength(password: string): PasswordStrength {
  const checks = [
    hasMinimumLength(password),
    hasNumbers(password),
    hasSpecialCharacters(password),
    hasMixedCase(password),
  ];

  const passedChecks = checks.filter(Boolean).length;

  if (passedChecks <= 1) return "weak";
  if (passedChecks <= 3) return "medium";
  return "strong";
}

function getStrengthPercentage(strength: PasswordStrength): string {
  const percentages = {
    weak: "33%",
    medium: "66%",
    strong: "100%",
  };
  return percentages[strength];
}
