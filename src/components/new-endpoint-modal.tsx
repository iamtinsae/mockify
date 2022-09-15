import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { inferMutationInput, trpc } from "../utils/trpc";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import cn from "classnames";
import {
  allowed_endpoint_methods,
  allowed_schema_types,
} from "../lib/validation";

type NewEndPointModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  resourceId: string;
  resourceName: string;
  afterLeave: () => void;
};

export default function NewEndPointModal({
  open,
  setOpen,
  resourceId,
  resourceName,
  afterLeave,
}: NewEndPointModalProps) {
  const cancelButtonRef = useRef(null);
  const utils = trpc.useContext();
  const [name, setName] = useState("");
  const [route, setRoute] = useState("/");
  const [method, setMethod] =
    useState<typeof allowed_endpoint_methods[number]>("GET");
  const { mutateAsync, isSuccess, isLoading, isError, reset } =
    trpc.useMutation("endpoints.create", {
      onSuccess: () => utils.invalidateQueries("projects.getMyProject"),
    });
  const [schemas, setSchemas] = useState<
    Array<{
      name: string;
      type: typeof allowed_schema_types[number];
    }>
  >([]);

  const removeSchema = (idx: number) => {
    const schemasCopy = Array.from(schemas);
    schemasCopy.splice(idx, 1);
    setSchemas(schemasCopy);
  };

  const addSchema = () => {
    setSchemas([
      ...schemas,
      {
        name: "",
        type: "ID",
      },
    ]);
  };

  const renderSchemasTable = () =>
    schemas.map((schema, idx) => (
      <tr key={`schema-${idx}`}>
        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
          {idx + 1}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
          <input
            type="text"
            value={schema.name}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            onChange={(e) => {
              const schemaCopy = Array.from(schemas);
              schemaCopy.splice(idx, 1, {
                name: e.target.value,
                type: schemas[idx]?.type ?? "ID",
              });
              setSchemas(schemaCopy);
            }}
          />
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
          <div>
            <select
              id="location"
              name="location"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              defaultValue={allowed_schema_types[0]}
              value={schema.type ?? "ID"}
              onChange={(e) => {
                const schemaCopy = Array.from(schemas);
                schemaCopy.splice(idx, 1, {
                  type: e.target.value as typeof allowed_schema_types[number],
                  name: schemas[idx]?.name ?? "",
                });
                setSchemas(schemaCopy);
              }}
            >
              {allowed_schema_types.map((schema_type) => (
                <option key={schema_type} value={schema_type}>
                  {schema_type}
                </option>
              ))}
            </select>
          </div>
        </td>
        <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => removeSchema(idx)}
          >
            Remove
          </a>
        </td>
      </tr>
    ));

  const handleSubmit = async () => {
    try {
      await mutateAsync({
        name,
        route,
        method,
        schemas,
        resourceId,
      });
      setOpen(false);
    } catch {}
  };

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => {
        reset();
        setName("");
        setRoute("");
        setMethod("GET");
        setSchemas([]);
        afterLeave();
      }}
    >
      <Dialog
        as="div"
        className="relative z-10"
        onClose={(open) => (!isLoading ? setOpen(open) : null)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur	transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-500 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="">
                    <div className="mt-3 text-center sm:mt-0 mx-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                      >
                        Create New EndPoint
                      </Dialog.Title>
                      <div className="mt-2">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                          >
                            Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="shadow-sm focus:ring-gray-800 focus:border-gray-500 block w-full sm:text-sm border-gray-300 dark:border-gray-900 rounded-md dark:bg-gray-500 dark:bg-opacity-20 focus:dark:bg-opacity-10 text-gray-200"
                              placeholder="Create User"
                              aria-describedby="name-description"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label
                            htmlFor="route"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                          >
                            Route
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="route"
                              id="route"
                              value={route}
                              onChange={(e) => setRoute(e.target.value)}
                              className="shadow-sm focus:ring-gray-800 focus:border-gray-500 block w-full sm:text-sm border-gray-300 dark:border-gray-900 rounded-md dark:bg-gray-500 dark:bg-opacity-20 focus:dark:bg-opacity-10 text-gray-200"
                              placeholder="/create/"
                              aria-describedby="route-description"
                            />
                          </div>
                          <p
                            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                            id="route-description"
                          >
                            Route can not be empty.
                            <code>
                              /{resourceName}/
                              {route !== "/" ? route.replace("/", "") : ""}
                            </code>
                          </p>
                        </div>

                        <div className="mt-4">
                          <label
                            htmlFor="method"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Method
                          </label>
                          <select
                            id="method"
                            name="method"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            defaultValue="GET"
                            onChange={(e) =>
                              setMethod(
                                e.target
                                  .value as inferMutationInput<"endpoints.create">["method"]
                              )
                            }
                          >
                            {allowed_endpoint_methods.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mt-4">
                          <button
                            type="button"
                            className="my-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={addSchema}
                          >
                            Add Schema
                          </button>
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  #
                                </th>
                                <th
                                  scope="col"
                                  className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Name
                                </th>
                                <th
                                  scope="col"
                                  className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Type
                                </th>
                                <th
                                  scope="col"
                                  className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6"
                                >
                                  <span className="sr-only">Edit</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {renderSchemasTable()}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-4">
                          {isError ? (
                            <div className="text-red-600 py-2">
                              <ExclamationCircleIcon className="h-6 inline-block mr-2" />
                              Failed to create endpoint. Please try again!
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className={cn(
                      "inline-flex w-full items-center disabled:bg-gray-500 disabled:text-gray-600 disabled:cursor-not-allowed justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition",
                      isSuccess
                        ? "bg-green-600 hover:bg-green-600 cursor-default focus:ring-0 focus:ring-offset-0"
                        : ""
                    )}
                    onClick={() => (isSuccess ? null : handleSubmit())}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div>
                        <svg
                          className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span>Creating Endpoint</span>
                      </div>
                    ) : isSuccess ? (
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 mr-2 mb-1 inline-block" />
                        <span>Created Successfully!</span>
                      </div>
                    ) : (
                      <span>Create Endpoint</span>
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
