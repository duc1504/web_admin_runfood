import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function EditProductModal(props) {
  const { showModalEdit, setShowModalEdit, selectedProduct } = props;
  const [able, setAble] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
    stock: 0, 
  });

  const [categories, setCategories] = useState([]);

  // Validation
  const validateForm = () => {
    for (const key in formData) {
      if (formData[key] === "") {
        return false;
      }
    }
    return true;
  };

  // Use validateForm to check validity when needed
  const isFormValid = validateForm();

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        price: selectedProduct.price || "",
        stock: selectedProduct.stock || "", // Ensure this field matches the quantity field
        description: selectedProduct.description || "",
        image: selectedProduct.image || "",
        category: selectedProduct.category || "",
      });
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://backend-runfood.vercel.app/categories");
        const data = response.data;
        if (data.status) {
          setCategories(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setAble(false);
      const file = files[0];
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "t9fgxqpw");

      axios.post(
        `https://api.cloudinary.com/v1_1/dcb2afzz4/image/upload`,
        data
      )
      .then((response) => {
        const imageUrl = response.data.url;
        setFormData((prevFormData) => ({
          ...prevFormData,
          image: imageUrl,
        }));
        setAble(true);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSave = async (e) => {
    try {
      if (!isFormValid) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please enter complete information",
        });
        return;
      }
      const response = await axios.put(
        `https://backend-runfood.vercel.app/product/update/${selectedProduct._id}`,
        formData
      );
      const data = response.data;
      if (data.status) {
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
          title: "Update product successfully",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1300);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
    }
  };

  return (
    <>
      {showModalEdit && (
        <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Information</h5>
                <button type="button" className="btn-close" onClick={() => setShowModalEdit(false)}></button>
              </div>
              <div className="modal-body">
                <div className="container">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="price" className="form-label">Price</label>
                      <input type="number" className="form-control" id="price" name="price" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="stock" className="form-label">Quantity</label>
                      <input type="number" className="form-control" id="stock" name="stock" value={formData.stock} onChange={handleChange} min="1" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea className="form-control" id="description" name="description" rows="3" value={formData.description} onChange={handleChange} required></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="image" className="form-label">Image</label>
                      <input type="file" className="form-control" id="image" name="image" onChange={handleChange} required />
                    </div>
                    <div className="mb-3 d-flex">
                      {formData.image && (
                        <div>
                          <img src={formData.image} alt="product" className="img-fluid" style={{ width: "50px", height: "50px", marginRight: "10px", objectFit: "cover" }} />
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="category_id" className="form-label">Category</label>
                      <select className="form-select" id="category_id" name="category_id" value={formData.category_id} onChange={handleChange} required>
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                  </form>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModalEdit(false)}>Close</button>
                <button type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={!able}
                >
                  Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EditProductModal;
