import type { NextPage, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState } from "react";
import LoadingOverlay from "../../components/loading-overlay";
import NewRouteModal from "../../components/new-resource-modal";
import { trpc } from "../../utils/trpc";

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const { slug } = context.query;
  return {
    props: { slug: slug?.toString() },
  };
};

type ProjectPageProps = { slug: string };

const ProjectPage: NextPage<ProjectPageProps> = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading } = trpc.useQuery([
    "projects.getMyProject",
    {
      slug: props.slug,
    },
  ]);

  return (
    <>
      <Head>
        <title>Mockify : {data?.name ?? "API mocking made easy."}</title>
      </Head>
      <LoadingOverlay visible={isLoading} />

      <main className="max-w-3xl p-8 mx-auto w-full">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 dark:text-white text-gray-900 sm:text-3xl sm:truncate">
              {data?.name}
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
              onClick={() => setModalOpen(true)}
            >
              New Resource
            </button>
            <button
              type="button"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Publish
            </button>
          </div>
        </div>
        <NewRouteModal
          projectSlug={props.slug}
          open={modalOpen}
          setOpen={setModalOpen}
        />
      </main>
    </>
  );
};

export default ProjectPage;
