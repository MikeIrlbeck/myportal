import type {
  Laborer,
  Material,
  Plant,
  SiteProblem,
  Weather,
  WeatherCondition,
  WorkProgress,
} from "@prisma/client";
import classNames from "classnames";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import PermissionToProject from "../../../../components/auth/PermissionToProject";
import SessionAuth from "../../../../components/auth/SessionAuth";
import DeleteButton from "../../../../components/common/DeleteButton";
import { LaborerView } from "../../../../components/siteDiary/laborer/LaborerView";
import { MaterialView } from "../../../../components/siteDiary/material/MaterialView";
import { PlantView } from "../../../../components/siteDiary/plant/PlantView";
import { SiteProblemView } from "../../../../components/siteDiary/siteProblem/siteProblemView";
import { WorkProgressView } from "../../../../components/siteDiary/workProgress/workProgressView";
import {
  useDeleteSiteDiary,
  useGetSiteDiary,
} from "../../../../hooks/siteDiary";
import { useUpdateSiteDiaryWeather } from "../../../../hooks/weather";

export type siteDiary = {
  weather: Weather | null;
  name: string;
  createdBy: {
    name: string | null;
  };
  plants: Plant[];
  laborers: Laborer[];
  materials: Material[];
  siteProblems: SiteProblem[];
  workProgresses: WorkProgress[];
};

const Dropdown = dynamic(
  () => import("../../../../components/siteDiary/weather/Dropdown")
);

const CreatePlantButton = dynamic(
  () => import("../../../../components/siteDiary/plant/CreateButton")
);
const CreateLaborerButton = dynamic(
  () => import("../../../../components/siteDiary/laborer/CreateButton")
);
const CreateMaterialButton = dynamic(
  () => import("../../../../components/siteDiary/material/CreateButton")
);
const CreateSiteProblemButton = dynamic(
  () => import("../../../../components/siteDiary/siteProblem/CreateButton")
);
const CreateWorkProgressButton = dynamic(
  () => import("../../../../components/siteDiary/workProgress/CreateButton")
);

const secondaryNavigation = [
  { name: "Plants" },
  { name: "Laborers" },
  { name: "Materials" },
  { name: "Site Problems" },
  { name: "Work progress" },
];

const SiteDiary = () => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("Plants");
  const siteDiaryId = router.query.siteDiaryId as string;
  const projectId = router.query.projectId as string;
  const { siteDiary, isLoading } = useGetSiteDiary({
    siteDiaryId: siteDiaryId,
  });
  const { updateSiteDiaryWeather } = useUpdateSiteDiaryWeather();
  const onWeatherChange = ({
    weather,
    time,
    value,
  }: {
    weather: Weather | null;
    time: string;
    value: WeatherCondition;
  }) => {
    updateSiteDiaryWeather({
      morning: time === "M" ? value : weather?.morning,
      afternoon: time === "A" ? value : weather?.afternoon,
      evening: time === "E" ? value : weather?.evening,
      siteDiaryId: siteDiaryId,
    });
  };

  const getView = (currentTab: string) => {
    switch (currentTab) {
      case "Plants":
        return <PlantView plants={siteDiary?.plants || []} />;
      case "Laborers":
        return <LaborerView laborers={siteDiary?.laborers || []} />;
      case "Materials":
        return <MaterialView materials={siteDiary?.materials || []} />;
      case "Site Problems":
        return <SiteProblemView siteProblems={siteDiary?.siteProblems || []} />;
      case "Work progress":
        return (
          <WorkProgressView workProgresses={siteDiary?.workProgresses || []} />
        );
      default:
        return <div>Not implemented</div>;
    }
  };

  const getCreateButton = (currentTab: string) => {
    switch (currentTab) {
      case "Plants":
        return <CreatePlantButton siteDiaryId={siteDiaryId} />;
      case "Laborers":
        return <CreateLaborerButton siteDiaryId={siteDiaryId} />;
      case "Materials":
        return <CreateMaterialButton siteDiaryId={siteDiaryId} />;
      case "Site Problems":
        return <CreateSiteProblemButton siteDiaryId={siteDiaryId} />;
      case "Work progress":
        return <CreateWorkProgressButton siteDiaryId={siteDiaryId} />;
      default:
        return <div>Not implemented</div>;
    }
  };

  const { deleteSiteDiary } = useDeleteSiteDiary({
    projectId: projectId,
  });

  return (
    <SessionAuth>
      <PermissionToProject projectId={projectId}>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          siteDiary && (
            <main>
              <h1 className="m-4">
                <span className="font-semibold text-black">
                  <div className="mx-4 flex items-center justify-between gap-x-3">
                    <span className="font-serif text-xl text-black">
                      {siteDiary.name}
                    </span>
                    <DeleteButton
                      title={`Delete Site Diary ${siteDiary.name}`}
                      subtitle="Are you sure you want to permanently delete this site diary?"
                      navigateBack={true}
                      onDelete={() => {
                        deleteSiteDiary({
                          siteDiaryId: siteDiaryId,
                        });
                      }}
                    />
                  </div>
                  <div className="mt-4 flex justify-evenly text-xs text-gray-400 md:hidden">
                    <span className="flex flex-col">
                      Morning{" "}
                      <Dropdown
                        weatherCondition={siteDiary.weather?.morning}
                        onWeatherChange={(value: WeatherCondition) =>
                          onWeatherChange({
                            weather: siteDiary.weather,
                            time: "M",
                            value: value,
                          })
                        }
                      />
                    </span>
                    <span className="flex flex-col">
                      Afternoon{" "}
                      <Dropdown
                        weatherCondition={siteDiary.weather?.afternoon}
                        onWeatherChange={(value: WeatherCondition) =>
                          onWeatherChange({
                            weather: siteDiary.weather,
                            time: "A",
                            value: value,
                          })
                        }
                      />
                    </span>
                    <span className="flex flex-col">
                      Evening
                      <Dropdown
                        weatherCondition={siteDiary.weather?.evening}
                        onWeatherChange={(value: WeatherCondition) =>
                          onWeatherChange({
                            weather: siteDiary.weather,
                            time: "E",
                            value: value,
                          })
                        }
                      />
                    </span>
                  </div>
                </span>
              </h1>

              <header className="border-b border-white/5">
                {/* Secondary navigation */}
                <nav className="flex justify-between overflow-x-auto border-b-2 border-gray-200 py-3">
                  <div className="flex space-x-1 px-4">
                    {secondaryNavigation.map((tab, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentTab(tab.name)}
                        className={classNames(
                          "relative rounded-md px-3 py-1.5 text-sm font-medium text-gray-300 outline-gray-800 transition focus-visible:outline-2",
                          currentTab === tab.name
                            ? "text-blue-100"
                            : "hover:bg-gray-100/100 "
                        )}
                      >
                        {currentTab === tab.name && (
                          <motion.span
                            layoutId="bubble"
                            className="absolute inset-0 rounded-md bg-gray-100"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                        <span className="relative z-10 mix-blend-exclusion">
                          {tab.name}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="mr-4 flex items-center text-xs text-gray-400">
                    <div className="mr-2 hidden md:flex">
                      <span className="mr-2 flex flex-col">
                        Morning:{" "}
                        <Dropdown
                          weatherCondition={siteDiary.weather?.morning}
                          onWeatherChange={(value: WeatherCondition) =>
                            onWeatherChange({
                              weather: siteDiary.weather,
                              time: "M",
                              value: value,
                            })
                          }
                        />
                      </span>
                      <span className="mr-2 flex flex-col">
                        Afternoon:{" "}
                        <Dropdown
                          weatherCondition={siteDiary.weather?.afternoon}
                          onWeatherChange={(value: WeatherCondition) =>
                            onWeatherChange({
                              weather: siteDiary.weather,
                              time: "A",
                              value: value,
                            })
                          }
                        />
                      </span>
                      <span className="mr-2 flex flex-col">
                        Evening:
                        <Dropdown
                          weatherCondition={siteDiary.weather?.evening}
                          onWeatherChange={(value: WeatherCondition) =>
                            onWeatherChange({
                              weather: siteDiary.weather,
                              time: "E",
                              value: value,
                            })
                          }
                        />
                      </span>
                    </div>
                    {getCreateButton(currentTab)}
                  </div>
                </nav>
              </header>
              {getView(currentTab)}
            </main>
          )
        )}
      </PermissionToProject>
    </SessionAuth>
  );
};

export default SiteDiary;
