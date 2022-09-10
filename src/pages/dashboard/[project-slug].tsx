import type { NextPage, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState, Fragment, useEffect } from "react";
import LoadingOverlay from "../../components/loading-overlay";
import NewRouteModal from "../../components/new-resource-modal";
import { trpc } from "../../utils/trpc";
import cn from "classnames";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import NewEndPointModal from "../../components/new-endpoint-modal";
import { Resource } from "@prisma/client";

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const { "project-slug": slug } = context.query;
  return {
    props: { slug: slug?.toString() },
  };
};

type ProjectPageProps = { slug: string };

const ProjectPage: NextPage<ProjectPageProps> = (props) => {
  const [newRouteModalOpen, setNewRouteModalOpen] = useState(false);
  const [newEndPointModalOpen, setNewEndPointModalOpen] = useState(false);
  const utils = trpc.useContext();
  const { data, isLoading } = trpc.useQuery([
    "projects.getMyProject",
    {
      slug: props.slug,
    },
  ]);
  const { mutateAsync, isLoading: isMutationLoading } = trpc.useMutation(
    "resources.delete",
    {
      onSuccess: () => {
        utils.invalidateQueries("projects.getMyProject");
      },
    }
  );
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );

  useEffect(() => {
    if (selectedResource) {
      setNewEndPointModalOpen(true);
    }
  }, [selectedResource]);

  const handleDeleteResource = async (id: string) => {
    await mutateAsync({
      resourceId: id,
    });
  };

  return (
    <>
      <Head>
        <title>Mockify : {data?.name ?? "API mocking made easy."}</title>
      </Head>
      <LoadingOverlay visible={isLoading || isMutationLoading} />

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
              onClick={() => setNewRouteModalOpen(true)}
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
          open={newRouteModalOpen}
          setOpen={setNewRouteModalOpen}
        />

        <NewEndPointModal
          resourceName={selectedResource?.name || ""}
          resourceId={selectedResource?.id || ""}
          open={newEndPointModalOpen}
          setOpen={(open) => setNewEndPointModalOpen(open)}
          afterLeave={() => setSelectedResource(null)}
        />

        <div className="">
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full">
                    <thead className="dark:bg-gray-50 bg-white">
                      <tr className="text-gray-900">
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold  sm:pl-6"
                        >
                          Route
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold"
                        >
                          Method
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold"
                        >
                          Schemas
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {data?.resources.map((resource) => (
                        <Fragment key={resource.id}>
                          <tr className="border-t border-gray-200">
                            <th
                              colSpan={3}
                              scope="colgroup"
                              className="bg-gray-50 px-4 py-2 text-left text-sm font-semibold text-gray-900 sm:px-6"
                            >
                              /{resource.name}/
                            </th>
                            <th className="bg-gray-50 px-4 py-2 text-right text-sm font-semibold text-gray-900 sm:px-6">
                              <button
                                type="button"
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={async () => {
                                  setSelectedResource(resource);
                                }}
                              >
                                <PlusCircleIcon className="h-4 w-4 mr-2" /> Add
                                Endpoint
                              </button>

                              <button
                                type="button"
                                className="ml-2 inline-flex items-center px-2 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                onClick={() =>
                                  handleDeleteResource(resource.id)
                                }
                              >
                                <MinusCircleIcon className="h-4 w-4" />
                              </button>
                            </th>
                          </tr>
                          {resource.endPoints.map((endPoint, endPointIdx) => (
                            <tr
                              key={endPoint.id}
                              className={cn(
                                endPointIdx === 0
                                  ? "border-gray-300"
                                  : "border-gray-200",
                                "border-t"
                              )}
                            >
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {endPoint.route}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {endPoint.method}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {3}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <a
                                  href="#"
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Edit
                                </a>
                              </td>
                            </tr>
                          ))}
                          {resource.endPoints.length === 0 ? (
                            <tr className="border-t border-gray-200">
                              <td
                                colSpan={4}
                                className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                              >
                                No endpoints created.
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProjectPage;
