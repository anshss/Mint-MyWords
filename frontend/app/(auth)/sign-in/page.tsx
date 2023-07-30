export const metadata = {
  title: "Sign In - Simple",
  description: "Page description",
};
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <section className="bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="max-w-md mx-auto">
            <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          </div>
        </div>
      </div>
    </section>
  );
}
