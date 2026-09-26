import CategoryFilter from "./CategoryFilter";
import BrandFilter from "./BrandFilter";
import PriceFilter from "./PriceFilter";
import RatingFilter from "./RatingFilter";
import AvailabilityFilter from "./AvailabilityFilter";
import DiscountFilter from "./DiscountFilter";
import ResetFilters from "./ResetFilters";

const FilterSidebar = () => {
  return (
    <>
      <CategoryFilter />
      <BrandFilter />
      <PriceFilter />
      <RatingFilter />
      <AvailabilityFilter />
      <DiscountFilter />
      <ResetFilters />
      
    </>
  );
};

export default FilterSidebar;