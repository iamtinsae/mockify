import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { trpc } from "../utils/trpc";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import cn from "classnames";
import { useRouter } from "next/router";

type NewRouteModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  projectSlug: string;
};

export default function NewRouteModal({
  open,
  setOpen,
  projectSlug,
}: NewRouteModalProps) {
  const cancelButtonRef = useRef(null);
  const router = useRouter();
  const [resourceName, setResourceName] = useState("");
  const { mutateAsync, isSuccess, isLoading, isError } =
    trpc.useMutation("resources.create");

  const handleSubmit = async () => {
    try {
      const resource = await mutateAsync({
        name: resourceName,
        projectSlug,
      });
      router.push(`/dashboard/${projectSlug}/${resource.name}/`);
    } catch {}
  };

  return (
    <Transition.Root show={open} as={Fragment}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-500 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="">
                    <div className="mt-3 text-center sm:mt-0 mx-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                      >
                        Create New Resource
                      </Dialog.Title>
                      <div className="mt-2">
                        <div>
                          <label
                            htmlFor="resource-name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                          >
                            Resource Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="resource-name"
                              id="resource-name"
                              value={resourceName}
                              onChange={(e) => setResourceName(e.target.value)}
                              className="shadow-sm focus:ring-gray-800 focus:border-gray-500 block w-full sm:text-sm border-gray-300 dark:border-gray-900 rounded-md dark:bg-gray-500 dark:bg-opacity-20 focus:dark:bg-opacity-10 text-gray-200"
                              placeholder="users"
                              aria-describedby="resource-name-description"
                            />
                          </div>
                          <p
                            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                            id="resource-description"
                          >
                            It will be used in the url e.g{" "}
                            <code>
                              {resourceName ? `/${resourceName}/` : "/users/"}
                            </code>
                            .
                          </p>
                        </div>

                        <div className="mt-4">
                          {isError ? (
                            <div className="text-red-600 py-2">
                              <ExclamationCircleIcon className="h-6 inline-block mr-2" />
                              Failed to create resource. Please try again!
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
                        <span>Creating Resource</span>
                      </div>
                    ) : isSuccess ? (
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-4 h-4 mr-2 mb-1 inline-block" />
                        <span>Redirecting...</span>
                      </div>
                    ) : (
                      <span>Create Resource</span>
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
