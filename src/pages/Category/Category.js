import React, { useEffect, useState } from "react";
import AddCateModal from "./AddCateModal";
import EditModalCate from "./EditCateModal";
import axios from 'axios';
import Swal from 'sweetalert2'

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModalInsert, setShowModalInsert] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch("https://backend-runfood.vercel.app/categories");
      const data = await response.json();
      console.log(data.status);
      if (data.data) {
        setCategories(data.data);
        console.log(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi lấy danh sách danh mục:", error);
    }
  };

  const handleEditClick = (cate) => {
    setSelectedCategory(cate);
    setShowModalEdit(true);
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete it?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://backend-runfood.vercel.app/categories/delete/${id}`)
          .then((response) => {
            if (response.data.status) {
              Swal.fire(
                {
                  title: 'Deleted!',
                  text: 'Your file has been deleted.',
                  icon: 'success',
                }
              )
              setTimeout(() => {
                window.location.reload();
              }, 1200);
            } else {
              console.error(response.data.message);
            }
          })
          .catch((error) => {
            console.error('Đã xảy ra lỗi khi xóa danh mục:', error);
          });
      }
    })
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <div className="container-fluid">
        <div className="row d-flex justify-content-center">
          <div className="col-md-offset-1 col-md-12">
            <div className="panel">
              <div className="panel-heading">
                <div className="row">
                  <div className="col-sm-12 col-xs-12">
                    <button
                      type="button"
                      onClick={() => setShowModalInsert(true)}
                      className="btn btn-sm btn-primary pull-left"
                    >
                      <i className="fa fa-plus-circle"></i> Add New
                    </button>
                    <h2 className="text-light">Quản lý danh mục</h2>
                  </div>
                </div>
              </div>
              <div className="panel-body table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>
                        <input type="checkbox" />
                      </th>
                      <th>#</th>
                      <th>Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories && categories.length > 0 ? (
                      categories.map((category, index) => (
                        <tr key={category._id}>
                          <td>
                            <input type="checkbox" />
                          </td>
                          <td>{index + 1}</td>
                          <td>{category.name}</td>
                          <td>
                            <ul className="action-list">
                              <li>
                                <button
                                  onClick={() => handleEditClick(category)}
                                  className="btn btn-primary"
                                >
                                  <i className="fa fa-edit"></i>
                                </button>
                              </li>
                              <li>
                                <button className="btn btn-danger"
                                  onClick={() => handleDeleteClick(category._id)}
                                >
                                  <i className="fa fa-times"></i>
                                </button>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No categories found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddCateModal showModalInsert={showModalInsert} setShowModalInsert={setShowModalInsert} />
      <EditModalCate showModalEdit={showModalEdit} setShowModalEdit={setShowModalEdit} selectedCategory={selectedCategory} />
    </>
  );
};

export default Category;
