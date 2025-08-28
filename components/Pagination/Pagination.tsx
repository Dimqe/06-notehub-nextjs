import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  page: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

const Pagination = ({ page, onPageChange, totalPages }: PaginationProps) => {
  const pageCount = Math.ceil(totalPages);

  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      forcePage={page - 1}
      pageCount={pageCount}
      onPageChange={(selectedItem) => onPageChange(selectedItem.selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageLinkClassName={css.pageLink}
      previousLabel="<"
      nextLabel=">"
    />
  );
};

export default Pagination;
