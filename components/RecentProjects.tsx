"use client";

import { FaLocationArrow } from "react-icons/fa6";
import { useTranslation } from "@/context/LanguageContext";

import { projects } from "@/data";
import { ExpandableProjectCard } from "./ui/ExpandableProjectCard";

const RecentProjects = () => {
  const { t } = useTranslation();
  const projectTranslations = t("projects.items") as Array<{
    title: string;
    des: string;
  }>;

  return (
    <div className="py-20">
      <h1 className="heading">
        {t("projects.headingPrefix")}{" "}
        <span className="text-purple">{t("projects.heading")}</span>
      </h1>
      <div className="flex flex-wrap items-center justify-center p-4 gap-16 mt-10">
        {projects.map((item, index) => (
          <div
            className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw]"
            key={item.id}
          >
            <ExpandableProjectCard
              item={{
                ...item,
                title: projectTranslations[index]?.title ?? item.title,
                des: projectTranslations[index]?.des ?? item.des,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;

