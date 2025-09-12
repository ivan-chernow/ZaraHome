import React from 'react';
import HorizontalLine from '@/shared/ui/HorizontalLine';
import Link from 'next/link';
import slugify from 'slugify';

const CatalogItem = ({
  card,
}: {
  card: { category: string; subtitle: string; img: string; link: string };
}) => {
  const customSlugify = (text: string) =>
    slugify(text.replace('й', 'y'), { lower: true, strict: true });
  const categorySlug = customSlugify(card.link);

  return (
    <li
      className="hover:scale-105 ease-in-out duration-300 shadow-lg"
      style={{
        cursor: 'pointer',
        backgroundImage: `url(${card.img})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '480px',
        width: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '52px',
      }}
    >
      <Link href={`/products/category/${categorySlug}`}>
        <div className="bg-white w-[337px] h-[189px] flex flex-col items-center justify-center mt-[370px]">
          <h2 className="text-[34px] mb-[11px] text-center">{card.category}</h2>
          <HorizontalLine width="237px" />
          <p className="text-[18px] mt-[9px] max-w-[231px] text-center">
            {card.subtitle}
          </p>
        </div>
      </Link>
    </li>
  );
};

export default CatalogItem;
