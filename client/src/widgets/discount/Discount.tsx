interface DiscountProps {
  discount: number;
}

const Discount: React.FC<DiscountProps> = ({ discount }) => {
  if (!discount || discount <= 0) {
    return null;
  }

  return (
    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
      -{discount}%
    </div>
  );
};

export default Discount;
