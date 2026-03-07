"use client";

import { FaLocationArrow } from "react-icons/fa6";
import { useTranslation } from "@/context/LanguageContext";

import { projects } from "@/data";
import { ExpandableProjectCard } from "./ui/ExpandableProjectCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/Carousel";

const RecentProjects = () => {
  const { t } = useTranslation();
  const projectTranslations = t("projects.items") as Array<{
    title: string;
    des: string;
    highlights?: string[];
    tags?: string[];
  }>;

  return (
    <div className="py-20">
      <h1 className="heading">
        {t("projects.headingPrefix")}{" "}
        <span className="text-purple">{t("projects.heading")}</span>
      </h1>
      {projects.length > 4 ? (
        <Carousel className="w-full max-w-7xl mx-auto mt-10" opts={{ align: "start" }}>
          <CarouselContent className="-ml-4">
            {projects.map((item, index) => (
              <CarouselItem
                key={item.id}
                className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 flex justify-center"
              >
                <div className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw]">
                  <ExpandableProjectCard
                    item={{
                      ...item,
                      title: projectTranslations[index]?.title ?? item.title,
                      des: projectTranslations[index]?.des ?? item.des,
                      highlights: projectTranslations[index]?.highlights ?? (item as any).highlights,
                      tags: projectTranslations[index]?.tags ?? (item as any).tags,
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-8">
            <CarouselPrevious className="static translate-y-0 translate-x-0" />
            <CarouselNext className="static translate-y-0 translate-x-0" />
          </div>
        </Carousel>
      ) : (
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
                  highlights: projectTranslations[index]?.highlights ?? (item as any).highlights,
                  tags: projectTranslations[index]?.tags ?? (item as any).tags,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentProjects;

