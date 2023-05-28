import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useDeleteProject, useGetProjects } from "../../hooks/project";

import { EnterIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useRef, useState } from "react";
import SessionAuth from "../../components/auth/SessionAuth";
import { Header } from "../../components/common/Header";
import Spinner from "../../components/common/Spinner";
import { project } from "../../components/project/EditButton";
import { api } from "../../utils/api";

const CreateButton = dynamic(
  () => import("../../components/project/CreateButton") // https://nextjs.org/docs/advanced-features/dynamic-import for lower First Load JS when "npm run build"
);

const DeleteButton = dynamic(
  () => import("../../components/common/DeleteButton")
);
const EditButton = dynamic(() => import("../../components/project/EditButton"));

const Projects = () => {
  const { projects, isLoading } = useGetProjects();
  const pendingDeleteCountRef = useRef(0);

  const { deleteProject } = useDeleteProject({ pendingDeleteCountRef });
  return (
    <SessionAuth>
      <Header />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="mx-auto flex h-screen max-w-7xl flex-col items-center px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full items-center justify-between">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Projects
            </h1>
            <CreateButton description="New Project" />
          </div>
          <div className="mt-8 flow-root w-full">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table
                  className="min-w-full divide-y divide-gray-300 overflow-hidden"
                  cellPadding={0}
                >
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className=" max-w-col max-w-xs px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:px-2"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 "
                      >
                        Created By
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Created On
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pr-3 text-sm sm:pr-2"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <AnimatePresence>
                      {projects?.map((project) => (
                        <MotionTR
                          key={project.id}
                          project={project}
                          deleteProject={() =>
                            deleteProject({ projectId: project.id })
                          }
                        />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
            {isLoading ? (
              <Spinner />
            ) : (
              <span className="flex justify-center">
                <p className="max-auto p-4 text-slate-500">End of projects</p>
              </span>
            )}
          </div>
        </div>
      )}
    </SessionAuth>
  );
};

const MotionTR = ({
  project,
  deleteProject,
}: {
  project: project;
  deleteProject: () => void;
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isDescriptionHovering, setIsDescriptionHovering] = useState(true);
  const router = useRouter();
  const utils = api.useContext();

  const onEnterCb = () => {
    setIsHovering(true);
    void utils.me.hasPermissionToProject.prefetch(
      { projectId: project.id },
      {
        staleTime: Infinity,
      }
    );
  };
  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
      transition={{ opacity: { duration: 0.2 } }}
      className={isHovering ? "w-full bg-slate-100" : "w-full"}
      onMouseEnter={onEnterCb}
      onMouseLeave={() => setIsHovering(false)}
    >
      <td
        className="w-col-s sm:w-col-l relative px-3 py-5 text-sm text-gray-500 hover:cursor-pointer"
        onClick={() =>
          void router.push(`/projects/${project.id}/financial-dashboard`)
        }
        onMouseEnter={() => setIsDescriptionHovering(true)}
        onMouseLeave={() => setIsDescriptionHovering(false)}
      >
        <div className="text-gray-900">{project.name}</div>
        {isDescriptionHovering && (
          <div className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black transition duration-300 hover:scale-125  hover:shadow-xl">
            <EnterIcon className="h-5 w-5 text-white" />
          </div>
        )}
      </td>
      <td className="px-3 py-5 text-sm text-gray-500">
        <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:justify-start lg:gap-3">
          <Image
            className=" h-8 w-8 rounded-full sm:h-11 sm:w-11"
            src={"/images/default-photo.jpg"}
            alt="Created by photo"
            width={44}
            height={44}
          />
          <div className="break-words font-medium text-gray-900">
            {project.createdBy.name}
          </div>
          {/* <div className="mt-1 text-gray-500">{task.createdBy?.email}</div> */}
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
        <div className="flex items-center">
          <div className="m-0">
            <div className="font-medium text-gray-900">{project.createdAt}</div>
          </div>
        </div>
      </td>
      <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        <span className="flex items-center justify-center">
          <EditButton project={project} />
          <DeleteButton
            title={`Delete Project ${project.name}`}
            subtitle="Are you sure you want to permanently delete this project?"
            onDelete={deleteProject}
          />
        </span>
        <span className="sr-only">{project.createdBy.name}</span>
      </td>
    </motion.tr>
  );
};

export default Projects;
