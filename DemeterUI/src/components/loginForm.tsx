import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingSpinner } from "./ui/loading-spinner";
import { LoginAPI } from "@/api/loginAPI";
import { useState } from "react";
import { useAuth } from "@/context/authContext";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginFormFields = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  // console.log(import.meta.env.MODE);
  //console.log(import.meta.env.BASE_URL);
  // console.log(import.meta.env.PROD);
  // console.log(import.meta.env.SSR);
  // console.log(import.meta.env.DEV);
  // console.log(import.meta.env.API);
  // console.log(import.meta.env.VITE_API_BASE_URL);
  // console.log(import.meta.env.VITE_APP_TITLE);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const [loginError, setLoginError] = useState<string | null>(null);
  const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    try {
      let credential = loginSchema.safeParse(data);
      if (credential.success) {
        let loginData = credential.data;
        const { accessToken } = await LoginAPI(
          loginData.email,
          loginData.password
        );

        setAccessToken(accessToken);
        setLoginError(null);
        navigate("/");
      }
    } catch (e: any) {
      console.log(e.message);
      setLoginError(e.message);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <form
        className={cn("flex flex-col gap-6", className)}
        {...props}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="text"
              placeholder="m@example.com"
              {...register("email")}
              className={`${
                errors.email
                  ? "focus-visible:ring-red-500 focus-visible:ring-2"
                  : "focus-visible:ring-2"
              }`}
            />
            {errors.email && (
              <small className="text-red-500">{errors.email.message}</small>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className={`${
                errors.password
                  ? "focus-visible:ring-red-500 focus-visible:ring-2"
                  : "focus-visible:ring-2"
              }`}
            />
            {errors.password && (
              <small className="text-red-500">{errors.password.message}</small>
            )}
          </div>
          <div className="grid gap-2">
            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitting ? <LoadingSpinner /> : undefined}
              {isSubmitting ? "Loading..." : "Submit"}
            </Button>
            {loginError && <small className="text-red-500">{loginError}</small>}
          </div>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="../signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
