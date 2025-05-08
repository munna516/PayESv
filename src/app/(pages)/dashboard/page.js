import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/auth/SignOutButton";

export const metadata = {
  title: "Dashboard - PayESV",
  description: "Your PayESV dashboard",
};

export default async function DashboardPage() {
  // Get the user's session
  const session = await getServerSession(authOptions);

  // If user is not authenticated, redirect to login
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Welcome, {session.user.name || "User"}!
              </h1>
              <SignOutButton />
            </div>
            <p className="mt-1 text-gray-500 dark:text-gray-300">
              You are now signed in to your account.
            </p>

            <div className="mt-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Your Account Information
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Name
                    </p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {session.user.name || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
