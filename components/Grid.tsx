"use client";

import { gridItems } from "@/data";
import { useTranslation } from "@/context/LanguageContext";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";

const gridTextKeys: Record<number, { title: string; desc?: string }> = {
  1: { title: "grid.item1Title", desc: "grid.item1Desc" },
  2: { title: "grid.item2Title", desc: "grid.item2Desc" },
  3: { title: "grid.item3Title" },
  6: { title: "grid.item6Title", desc: "grid.item6Desc" },
  7: { title: "grid.item7Title" },
};

const Grid = () => {
  const { t } = useTranslation();

  return (
    <section>
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
