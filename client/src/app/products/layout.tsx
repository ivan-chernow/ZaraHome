import CatalogAccordion from '@/entities/catalog/ui/CatalogAccordion';
import MainLayout from '@/widgets/layout/MainLayout';
import Container from '@mui/material/Container';

interface ProductsLayoutProps {
  children: React.ReactNode;
}

const ProductsLayout: React.FC<ProductsLayoutProps> = ({ children }) => {
  return (
    <MainLayout>
      <Container maxWidth="lg" className="pb-[105px]">
        <div className="flex pt-[41px] items-start">
          <div className="w-[250px] flex-shrink-0 top-10 sticky">
            <CatalogAccordion />
          </div>
          <div className="flex-1 pl-[20px]">{children}</div>
        </div>
      </Container>
    </MainLayout>
  );
};

export default ProductsLayout;
