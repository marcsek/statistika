import React from "react";

export default function Pagination({ postsPerPage, totalPosts, paginateFront, paginateBack, currentPage }) {
  return (
    <div className="pagi-cont">
      <button
        id={currentPage > 1 ? "" : "inactive"}
        onClick={(e) => {
          e.preventDefault();
          paginateBack();
        }}
      >
        Predošlé
      </button>
      <p className="pagi-text">
        Showing
        <span className="font-medium">{currentPage * postsPerPage - 9}</span>
        to
        <span className="font-medium"> {currentPage * postsPerPage} </span>
        of
        <span className="font-medium"> {totalPosts} </span>
        results
      </p>
      <button
        id={currentPage + 1 <= totalPosts / postsPerPage ? "" : "inactive"}
        onClick={(e) => {
          e.preventDefault();
          paginateFront();
        }}
      >
        Ďalšie
      </button>
    </div>
  );
}
