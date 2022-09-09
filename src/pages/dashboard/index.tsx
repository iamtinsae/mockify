import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import cn from "classnames";
import NewProjectModal from "../../components/new-project-modal";
import { useState } from "react";
import LoadingOverlay from "../../components/loading-overlay";

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
  return (
    <>
      <Head>
        <title>Mockify: manage your projects</title>
      </Head>
      <LoadingOverlay visible={status !== "authenticated"} />
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
      </main>
    </>
  );
};

export default DashboardPage;
