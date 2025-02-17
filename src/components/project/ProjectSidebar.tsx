import { Dialog, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useAtom } from "jotai";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { Fragment, useEffect, useState } from "react";
import defaultPhoto from "../../../public/images/default-photo.jpg";
import mainLogo from "../../../public/images/logos/main-logo.png";
import {
  activeDateFiltersAtom,
  activeSearchFiltersAtom as activeSearchFiltersAtomForSiteDiary,
} from "../../atoms/siteDiaryAtoms";
import {
  activeSearchFiltersAtom as activeSearchFiltersAtomForTask,
  activeStatusFiltersAtom,
} from "../../atoms/taskAtoms";
import { env } from "../../env/client.mjs";
import { INFINITE_QUERY_LIMIT, getSearchType } from "../../hooks/task";
import { api } from "../../utils/api";
import { projectFeatures } from "../project/data";
import { getDateFromActiveFilter } from "../siteDiary/DateFilter";

const ProjectSidebar = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const utils = api.useContext();
  const session = useSession();
  const [activeStatusFilters] = useAtom(activeStatusFiltersAtom);
  const [activeSearchFiltersForTask] = useAtom(activeSearchFiltersAtomForTask);
  const [activeSearchFiltersForSiteDiary] = useAtom(
    activeSearchFiltersAtomForSiteDiary
  );
  const [activeDateFilters] = useAtom(activeDateFiltersAtom);

  const prefetch = ({
    projectId,
    href,
  }: {
    projectId: string;
    href: string;
  }) => {
    switch (href) {
      case "/file-manager":
        void utils.s3.fetchS3BucketContents.prefetch(
          {
            projectId: projectId,
            prefix: "/",
            aws_s3_bucket_name: env.NEXT_PUBLIC_AWS_S3_FILE_MANAGER_BUCKET_NAME,
          },
          {
            staleTime: Infinity,
          }
        );
        break;
      case "/invoice":
        void utils.s3.fetchS3BucketContents.prefetch(
          {
            projectId: projectId,
            prefix: "/",
            aws_s3_bucket_name: env.NEXT_PUBLIC_AWS_S3_INVOICES_BUCKET_NAME,
          },
          {
            staleTime: Infinity,
          }
        );
        break;
      case "/site-diary":
        void utils.siteDiary.getSiteDiaries.prefetch(
          {
            projectId: projectId,
            siteDiaryNames: activeSearchFiltersForSiteDiary.map(
              (activeSearchFilter) => activeSearchFilter.value
            ),
            startDate: getDateFromActiveFilter(true, activeDateFilters),
            endDate: getDateFromActiveFilter(false, activeDateFilters),
          },
          {
            staleTime: Infinity,
          }
        );
        break;
      case "/task":
        void utils.task.getTasks.prefetchInfinite(
          {
            projectId: projectId,
            limit: INFINITE_QUERY_LIMIT,
            statuses: activeStatusFilters.map(
              (activeStatusFilter) => activeStatusFilter.value
            ),
            searches: activeSearchFiltersForTask.map((activeSearchFilter) => {
              return {
                category: getSearchType(activeSearchFilter.label),
                value: activeSearchFilter.value,
              };
            }),
          },
          undefined,
          {
            staleTime: Infinity,
          }
        );
        break;
      case "/team":
        void utils.user.getUsersForProject.prefetch(
          { projectId: projectId },
          {
            staleTime: Infinity,
          }
        );
        void utils.user.getUsers.prefetch(undefined, {
          staleTime: Infinity,
        });
        void utils.me.isCreatorOfProject.prefetch(
          { projectId: projectId },
          {
            staleTime: Infinity,
          }
        );
        break;
      case "/settings":
        void utils.me.getMyProfessionalRole.prefetch(
          { projectId: projectId },
          {
            staleTime: Infinity,
          }
        );
        void utils.project.getProject.prefetch(
          { projectId: projectId },
          {
            staleTime: Infinity,
          }
        );
        void utils.me.isCreatorOfProject.prefetch(
          { projectId: projectId },
          {
            staleTime: Infinity,
          }
        );
        void utils.project.getProjectCreator.prefetch(
          { projectId: projectId },
          {
            staleTime: Infinity,
          }
        );
        break;
      default:
      // do nothing
    }
  };

  useEffect(() => {
    const hrefs = projectFeatures.map((feature) => feature.href);
    const activeTab = hrefs.find((href) => router.asPath.match(href));
    setActiveTab(activeTab || "");
  }, [router.asPath]);

  return (
    <div>
      {/* Sidebar for mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 xl:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-50 px-6 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    <Image
                      className="mx-auto h-16 w-auto"
                      src={mainLogo}
                      alt="MySmart Portal"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {projectFeatures.map((item) => (
                            <li key={item.name}>
                              <Link
                                className={classNames(
                                  activeTab === item.href
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400  hover:bg-blue-100 hover:text-black",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                )}
                                href={`/projects/${projectId}${item.href}`}
                                onMouseEnter={() =>
                                  prefetch({
                                    projectId: projectId,
                                    href: item.href,
                                  })
                                }
                                onClick={() => {
                                  setSidebarOpen(false);
                                  setActiveTab(item.href);
                                }}
                              >
                                <span
                                  className="h-6 w-6 shrink-0"
                                  aria-hidden="true"
                                >
                                  {item.icon}
                                </span>
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="-mx-6 mt-auto">
                        <Menu as="div" className="relative">
                          <div>
                            <Menu.Button className="flex w-full items-center justify-between px-6 py-3 text-sm font-semibold leading-6 text-black hover:bg-gray-100">
                              <span className="flex w-44 items-center">
                                <span className="sr-only">
                                  Your profile picture
                                </span>
                                <Image
                                  className="mr-4 h-8 w-8 rounded-full bg-gray-800"
                                  src={
                                    session.data?.user?.image || defaultPhoto
                                  }
                                  alt="Your Profile Picture"
                                  width={32}
                                  height={32}
                                />
                                <span className="sr-only">
                                  Your profile name
                                </span>
                                <span aria-hidden="true">
                                  {session.data?.user?.name}
                                </span>
                              </span>
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute bottom-14 left-4 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <Menu.Item>
                                {({ active }) => (
                                  <span
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                    onClick={() =>
                                      void (async () => {
                                        await router.push("/");
                                        await signOut();
                                      })()
                                    }
                                  >
                                    Sign out
                                  </span>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Static sidebar for desktop */}
      <div className="z-[15] hidden xl:fixed xl:inset-y-0 xl:flex xl:w-72 xl:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-50 px-6 ring-1 ring-black/5">
          <div className="flex h-16 shrink-0 items-center">
            <Image
              className="mx-auto h-32 w-auto"
              src={mainLogo}
              alt="MySmart Portal"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {projectFeatures.map((projectFeature) => (
                    <li key={projectFeature.name}>
                      <Link
                        className={classNames(
                          activeTab === projectFeature.href
                            ? "bg-blue-600 text-white"
                            : "text-gray-400  hover:bg-gray-100 hover:text-black",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )}
                        href={`/projects/${projectId}${projectFeature.href}`}
                        onMouseEnter={() =>
                          prefetch({
                            projectId: projectId,
                            href: projectFeature.href,
                          })
                        }
                        onClick={() => {
                          setActiveTab(projectFeature.href);
                        }}
                      >
                        <span className="h-6 w-6 shrink-0" aria-hidden="true">
                          {projectFeature.icon}
                        </span>
                        {projectFeature.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button className="flex w-full items-center justify-between px-6 py-3 text-sm font-semibold leading-6 text-black hover:bg-gray-100">
                      <span className="flex w-44 items-center">
                        <span className="sr-only">Your profile picture</span>
                        <Image
                          className="mr-4 h-8 w-8 rounded-full bg-gray-800"
                          src={session.data?.user?.image || defaultPhoto}
                          alt="Your Profile Picture"
                          width={32}
                          height={32}
                        />
                        <span className="sr-only">Your profile name</span>
                        <span aria-hidden="true">
                          {session.data?.user?.name}
                        </span>
                      </span>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute bottom-14 left-4 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                            onClick={() =>
                              void (async () => {
                                await router.push("/");
                                await signOut();
                              })()
                            }
                          >
                            Sign out
                          </span>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="xl:pl-72">
        <div className="sticky top-0 z-[15] flex h-16 shrink-0 items-center justify-between border-b bg-white px-4 shadow-sm sm:px-6 lg:px-8 xl:hidden">
          <Link href="/" aria-label="Home">
            <Image
              className="mx-auto mb-2 h-32 w-auto"
              src={mainLogo}
              alt="MySmart Portal"
            />
          </Link>
          <button
            type="button"
            className="-m-2.5 p-2.5 text-black "
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ProjectSidebar;
