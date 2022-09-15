import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import cn from "classnames";
import NewProjectModal from "../../components/new-project-modal";
import { useState } from "react";
import LoadingOverlay from "../../components/loading-overlay";
import { trpc } from "../../utils/trpc";
import Link from "next/link";

type DashboardHeaderProps = {
  user?: {
    username?: string | null;
    image?: string | null;
  };
};

const DashboardHeader = ({ user }: DashboardHeaderProps) => (
  <header className={cn("flex flex-col")}>
    <div className="border-b border-gray-300 dark:border-gray-700 flex items-center p-8 justify-center">
      <div className="max-w-3xl w-full text-white flex justify-between items-center">
        <span>{user?.username?.toLowerCase() || "Mockify"}</span>
        <button
          onClick={() =>
            signOut({
              redirect: true,
              callbackUrl: "/",
            })
          }
          className="bg-white px-6 py-2 rounded-sm text-gray-900"
        >
          Sign Out
        </button>
      </div>
    </div>
    <div></div>
  </header>
);

const DashboardPage: NextPage = () => {
  const { data, status } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const { data: projectsData, isLoading } = trpc.useQuery([
    "projects.getAllMyProjects",
  ]);

  return (
    <>
      <Head>
        <title>Mockify: manage your projects</title>
      </Head>
      <LoadingOverlay visible={status !== "authenticated" || isLoading} />
      <DashboardHeader
        user={{
          image: data?.user?.image,
          username: data?.user?.username,
        }}
      />

      <main className="max-w-3xl w-full mx-auto py-8">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-white px-6 py-2 rounded-sm text-gray-900 hover:bg-gray-100"
        >
          Create New Project
        </button>
        <NewProjectModal open={modalOpen} setOpen={setModalOpen} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
          {projectsData?.map((project) => (
            <div
              key={project.id}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <div className="flex-1 min-w-0">
                <Link href={`/dashboard/${project.slug}`} passHref>
                  <a href="#" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">
                      {project.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {project.slug}
                    </p>
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default DashboardPage;
