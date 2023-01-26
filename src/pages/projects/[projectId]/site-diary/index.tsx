import { useRouter } from "next/router";
import SessionAuth from "../../../../components/auth/SessionAuth";
import { useGetSiteDiaries } from "../../../../hooks/siteDiary";
import { api } from "../../../../utils/api";

const SiteDiary = () => {
  const router = useRouter();
  const utils = api.useContext();
  const projectId = router.query.projectId as string;
  const { siteDiaries, isLoading, isError } = useGetSiteDiaries({
    projectId: projectId,
  });

  return (
    <SessionAuth>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error!</div>
      ) : (
        <div className="flex h-screen">
          <div className="m-auto">
            <div className="text-lg font-medium">Site Diaries</div>
            <ul>
              {siteDiaries?.map((siteDiary) => (
                <li
                  key={siteDiary.id}
                  className="w-full bg-blue-500 text-white hover:bg-blue-200 hover:text-blue-500"
                  onClick={() =>
                    void router.push(
                      `/projects/${projectId}/site-diary/${siteDiary.id}`
                    )
                  }
                  onMouseEnter={() => {
                    void utils.siteDiary.getSiteDiary.prefetch(
                      {
                        siteDiaryId: siteDiary.id,
                      },
                      {
                        staleTime: Infinity,
                      }
                    );
                  }}
                >
                  <div>
                    <span className="mr-4">{siteDiary.name}</span>
                    <span className="mr-4">{siteDiary.createdBy}</span>
                    <span className="mr-4">{siteDiary.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </SessionAuth>
  );
};

// export async function getStaticProps(context: GetStaticPropsContext) {
//   if (!context.params) {
//     return {
//       props: {},
//     };
//   }
//   const project = await prisma.project.findUnique({
//     where: {
//       id: context.params.projectId as string,
//     },
//     include: {
//       createdBy: {
//         select: {
//           name: true,
//         },
//       },
//       siteDiaries: {
//         include: {
//           createdBy: {
//             select: {
//               name: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   if (!project) {
//     // need this as "fallback: true". Because fallback is true, no 404 page would be pre-rendered for paths that don't exist. Rather,
//     // when a non-existing path is requested, getStaticProps tries to render the page with the projectId on-the-fly, if !project, we then
//     // return  notFound: true } which will show the 404 page: https://stackoverflow.com/questions/67787456/what-is-the-difference-between-fallback-false-vs-true-vs-blocking-of-getstaticpa
//     return { notFound: true };
//   }

//   return {
//     props: {
//       siteDiariesFromStaticProps: project.siteDiaries.map((siteDiary) => ({
//         id: siteDiary.id,
//         name: siteDiary.name,
//         date: siteDiary.date.toLocaleDateString(),
//         createdBy: siteDiary.createdBy.name,
//       })),
//     },
//     revalidate: 60 * 60 * 24, // revalidate every 24 hours
//   };
// }

// export async function getStaticPaths() {
//   const projects = await prisma.project.findMany();
//   const projectIds = projects.map((project) => project.id);
//   return {
//     paths: projectIds.map((projectId) => ({
//       params: { projectId: projectId },
//     })),
//     fallback: true,
//   };
// }

export default SiteDiary;
