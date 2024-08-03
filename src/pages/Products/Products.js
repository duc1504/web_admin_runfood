import React, { useEffect, useState } from "react";
import "../../styles/styleProducts.css";
import Swal from "sweetalert2";
import axios from "axios";
import EditProductModal from "./EditProductModal";
import AddProductModal from "./AddProductModal";

function Products() {
  const [products, setProducts] = useState([]);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalInsert, setShowModalInsert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 10; // Số sản phẩm mỗi trang

  const fetchProducts = async (page = 1) => {
    try {
      const response = await axios.get(`https://backend-runfood.vercel.app/product?page=${page}&limit=${itemsPerPage}`);
      setProducts(response.data.data);
      setTotalProducts(response.data.totalProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowModalEdit(true);
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete it?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://backend-runfood.vercel.app/product/delete/${id}`)
          .then((response) => {
            if (response.data.status) {
              fetchProducts(currentPage);
            } else {
              console.error(response.data.message);
            }
          })
          .catch((error) => {
            console.error("Đã xảy ra lỗi khi xóa danh mục:", error);
          });
      }
    });
  };

  const handleSearch = async (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    
    try {
      if (searchTerm.length > 0) {
        const response = await axios.get(`https://backend-runfood.vercel.app/product/search?name=${searchTerm}`);
        setProducts(response.data.data);
      } else {
        fetchProducts(currentPage);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  console.log(totalProducts);

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
                  <div className="col-sm-12 col-xs-12 d-flex justify-content-between align-items-center">
                    <div className="search-bar">
                      <button
                        type="button"
                        onClick={() => setShowModalInsert(true)}
                        className="btn btn-sm btn-primary pull-left"
                      >
                        <i className="fa fa-plus-circle"></i> Add New
                      </button>
                    </div>
                    <h2 className="text-light mb-0">Quản lí sản phẩm</h2>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
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
                      <th>Image</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item, index) => (
                      <tr key={item._id}>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{item.name}</td>
                        <td>
                          <img
                            style={{ width: "100px", height: "100px", objectFit: "contain" }}
                            src={item.image}
                            alt={item.name}
                          />
                        </td>
                        <td>{item.price}</td>
                        <td>
                          <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            defaultValue={item.stock}
                            min="1"
                            max={1000}
                          ></input>
                        </td>
                        <td>
                          <ul className="action-list">
                            <li>
                              <button
                                onClick={() => handleEditClick(item)}
                                className="btn btn-primary"
                              >
                                <i className="fa fa-edit"></i>
                              </button>
                            </li>
                            <li>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleDeleteClick(item._id)}
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <i className="fa fa-chevron-left"></i>
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <i className="fa fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditProductModal
        showModalEdit={showModalEdit}
        setShowModalEdit={setShowModalEdit}
        selectedProduct={selectedProduct}
      />
      <AddProductModal
        showModalInsert={showModalInsert}
        setShowModalInsert={setShowModalInsert}
      />
    </>
  );
}

export default Products;
