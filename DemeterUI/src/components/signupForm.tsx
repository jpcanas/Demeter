import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router";
import { Checkbox } from "./ui/checkbox";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingSpinner } from "./ui/loading-spinner";

const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(5),
    confirmPassword: z.string().min(5),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "The passwords didn't match",
    path: ["confirmPassword"],
  });

type SignupFormField = z.infer<typeof signupSchema>;

export default function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormField>({ resolver: zodResolver(signupSchema) });

  const onSignup: SubmitHandler<SignupFormField> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000)); //simulate server action
      let result = signupSchema.safeParse(data);
      console.log(result);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="w-full max-w-sm">
      <form
        className={cn("flex flex-col gap-4", className)}
        {...props}
        onSubmit={handleSubmit(onSignup)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-2 items-end">
            <Label htmlFor="email">Email</Label>
            <Input
              className={`${
                errors.email
                  ? "focus-visible:ring-red-500 focus-visible:ring-2"
                  : "focus-visible:ring-2"
              }`}
              id="email"
              type="text"
              placeholder="john@sample,com"
              {...register("email")}
            />
            <small className="text-red-500">
              {errors.email && errors.email.message}
            </small>
          </div>
          <div className="grid gap-2 items-end">
            <Label htmlFor="password">Password</Label>
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
            <small className="text-red-500">
              {errors.password && errors.password.message}
            </small>
          </div>
          <div className="grid gap-2 items-end">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              className={`${
                errors.confirmPassword
                  ? "focus-visible:ring-red-500 focus-visible:ring-2"
                  : "focus-visible:ring-2"
              }`}
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
            {
              <small className="text-red-500">
                {errors.confirmPassword && errors.confirmPassword.message}
              </small>
            }
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>
        </div>
        <div className="grid gap-5">
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <Button variant="outline" className="w-full" type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 48 48"
            >
              <path
                fill="#fbc02d"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#e53935"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4caf50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1565c0"
                d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Login with Google
          </Button>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <LoadingSpinner /> : undefined}
            {isSubmitting ? "Submitting" : "Create an Account"}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              to="../login"
              className="underline underline-offset-4 text-primary"
            >
              Login here
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
