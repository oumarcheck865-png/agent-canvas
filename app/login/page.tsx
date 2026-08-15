import AuthForm from "@/components/auth-form";
import { RequireGuest } from "@/components/auth-guard";

export default function LoginPage() {
  return (
    <RequireGuest>
      <AuthForm mode="login" />
    </RequireGuest>
  );
}
