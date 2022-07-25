import React from "react";
import { HiChevronDoubleRight, HiChevronDoubleLeft } from "react-icons/hi";

export default function Pagination({ postsPerPage, totalPosts, paginateFront, paginateBack, currentPage, isLoading }) {
  return (
    <div className="pagi-cont">
      <button
        id={currentPage > 1 && !isLoading ? "" : "inactive"}
        onClick={(e) => {
          e.preventDefault();
          paginateBack();
        }}
      >
        <HiChevronDoubleLeft />
      </button>
      <p className="pagi-text">
        Ukazuje
        <span className="font-medium">{!isLoading ? currentPage * postsPerPage - postsPerPage + 1 : "..."}</span>
        po
        <span className="font-medium">
          {!isLoading ? (currentPage * postsPerPage <= totalPosts ? currentPage * postsPerPage : totalPosts) : "..."}
        </span>
        zo
        <span className="font-medium"> {!isLoading ? totalPosts : "..."} </span>
        výsledkov
      </p>
      <button
        id={currentPage < totalPosts / postsPerPage && !isLoading ? "" : "inactive"}
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
