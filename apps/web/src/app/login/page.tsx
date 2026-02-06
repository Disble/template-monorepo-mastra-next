import { GoogleLogin } from "#components/google-login";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <GoogleLogin />
    </div>
  );
}
