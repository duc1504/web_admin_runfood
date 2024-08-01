import React, { useState } from 'react'
import axios from 'axios';
import Swal from "sweetalert2";
const AddCateModal = (props) => {
    const {showModalInsert, setShowModalInsert} = props;
    const [nameCate, setNameCate] = useState('')
    
    const handleSubmit = (e) => {
        try {
          if (nameCate==='') {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Please enter complete information",
              
            });
          }
          const category = {
            name: nameCate
        };
    
        axios.post('https://backend-runfood.vercel.app/categories/add', category, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if (response.data.status) {
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                },
              });
              Toast.fire({
                icon: "success",
                title: "Add product successfully",
              });
                setTimeout(() => {
                  window.location.reload();
                },1200);
                setShowModalInsert(false);
                setNameCate('');
            } else {
                console.error(response.data.message);
            }
        })
        .catch((error) => {
            console.error('Đã xảy ra lỗi khi thêm danh mục:', error);
        });


          
        } catch (error) {
          console.log(error);
        }
        
    };

  return (
    <>
    {showModalInsert && (
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
                onClick={() => setShowModalInsert(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="container">
                <form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={nameCate}
                      onChange={(e) => setNameCate(e.target.value)}
                      required
                    />
                  </div>

              
                 
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModalInsert(false)}
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

export default AddCateModal
