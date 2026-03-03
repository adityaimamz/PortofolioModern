"use client";

import { gridItems } from "@/data";
import { useTranslation } from "@/context/LanguageContext";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";

const gridTextKeys: Record<number, { title: string; desc?: string }> = {
  1: { title: "grid.item1Title", desc: "grid.item1Desc" },
  2: { title: "grid.item2Title" },
  3: { title: "grid.item3Title", desc: "grid.item3Desc" },
  4: { title: "grid.item4Title" },
  5: { title: "grid.item5Title", desc: "grid.item5Desc" },
  6: { title: "grid.item6Title" },
};

const Grid = () => {
  const { t } = useTranslation();

  return (
    <section id="about">
      <BentoGrid className="w-full py-20">
        {gridItems.map((item, i) => (
          <BentoGridItem
            id={item.id}
            key={i}
            title={gridTextKeys[item.id] ? t(gridTextKeys[item.id].title) : item.title}
            description={gridTextKeys[item.id]?.desc ? t(gridTextKeys[item.id].desc!) : item.description}
            className={item.className}
            img={item.img}
            imgClassName={item.imgClassName}
            titleClassName={item.titleClassName}
            spareImg={item.spareImg}
          />
        ))}
      </BentoGrid>
    </section>
  );
};

export default Grid;

