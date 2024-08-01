import axios from 'axios';
import React, { useEffect, useState } from 'react'

 const DeleteProducModal = (props) => {
  const { showModalDelete, setShowModalDelete, selectedProduct } = props;

  console.log(selectedProduct);

  const handleSubmit = () => {
    axios
      .delete(`https://api-treeshop.onrender.com/product/delete/${selectedProduct._id}`)
      .then((response) => {
        if (response.data.status) {
          alert('Xóa thành công');
          window.location.reload();
          setShowModalDelete(false);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error('Đã xảy ra lỗi khi xóa danh mục:', error);
      });
  };
 
  
  return (
    <>
    {showModalDelete && (
      <div
        className="modal fade show"
        tabIndex="-1"
        style={{ display: "block" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Categories</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModalDelete(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="container">
              <p className='text-dark'>Bạn có chắc chắn muốn xóa {selectedProduct.name} không?</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModalDelete(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default DeleteProducModal
