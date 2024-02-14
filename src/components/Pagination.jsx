const Pagination = ({currentIndex, goNext, goPrev, lastIndex}) => {
  return (
    <div className="pagination">
      <button onClick={goPrev} disabled={currentIndex === 0}>Prev</button>
      <button onClick={goNext} disabled={currentIndex === lastIndex}>Next</button>
    </div>
  );
};

export default Pagination;