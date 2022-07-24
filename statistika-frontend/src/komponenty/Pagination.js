import React from "react";
import { HiChevronDoubleRight, HiChevronDoubleLeft } from "react-icons/hi";

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
        <HiChevronDoubleLeft />
      </button>
      <p className="pagi-text">
        Ukazuje
        <span className="font-medium">{currentPage * postsPerPage - postsPerPage + 1}</span>
        po
        <span className="font-medium"> {currentPage * postsPerPage} </span>zo<span className="font-medium"> {totalPosts} </span>
        výsledkov
      </p>
      <button
        id={currentPage < totalPosts / postsPerPage ? "" : "inactive"}
        onClick={(e) => {
          e.preventDefault();
          paginateFront();
        }}
      >
        <HiChevronDoubleRight />
      </button>
    </div>
  );
}
