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
        Ukazuje
        <span className="font-medium">{currentPage * postsPerPage - postsPerPage + 1}</span>
        do
        <span className="font-medium"> {currentPage * postsPerPage} </span>zo<span className="font-medium"> {totalPosts} </span>
        výsledkov
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
