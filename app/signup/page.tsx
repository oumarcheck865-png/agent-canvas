import AuthForm from "@/components/auth-form";
import { RequireGuest } from "@/components/auth-guard";

export default function SignupPage() {
  return (
    <RequireGuest>
      <AuthForm mode="signup" />
    </RequireGuest>
  );
}
