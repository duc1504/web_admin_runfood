import React, { useState, useEffect } from "react";
import axios from "axios";

function Update() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    gallery: [], // Thay đổi gallery thành một mảng để lưu nhiều hình ảnh
    category_id: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://api-treeshop.onrender.com/category");
        const data = await response.json();
        if (data.status) {
          setCategories(data.categories);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Đã xảy ra lỗi khi lấy danh sách danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, files } = e.target;
    // Kiểm tra nếu có files được chọn và name là 'gallery'
    if (name === 'gallery' && files.length > 0) {
      const uploadedImages = [];
      const uploaders = Array.from(files).map((file) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 't9fgxqpw'); // Đổi tên preset_key thành 't9fgxqpw' hoặc sử dụng biến preset_key nếu đã khai báo ở trên
        return axios.post(`https://api.cloudinary.com/v1_1/dcb2afzz4/image/upload`, data);
      });

      // Chờ cho tất cả các request upload hoàn thành
      Promise.all(uploaders)
        .then((responses) => {
          responses.forEach((response) => {
            uploadedImages.push(response.data.url);
          });
          // Cập nhật state với mảng hình ảnh đã tải lên
          setFormData({
            ...formData,
            gallery: [...formData.gallery, ...uploadedImages],
          });
        })
        .catch((error) => {
          console.error("Đã xảy ra lỗi khi tải lên ảnh:", error);
        });
    } else {
      // Xử lý các trường thông tin khác
      const { value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://api-treeshop.onrender.com/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.status) {
        console.log("Thêm sản phẩm thành công");
        // Reset form after successful submission
        setFormData({
          name: "",
          price: "",
          quantity: "",
          description: "",
          gallery: [],
          category_id: "",
        });
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi thêm sản phẩm:", error);
    }
  };
  return (
    <div className="container mt-5 w-50">
      <h1>Thêm sản phẩm mới</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">
            Quantity
          </label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="gallery" className="form-label">
            Gallery
          </label>
          <input
            type="file"
            className="form-control"
            id="gallery"
            name="gallery"
            multiple
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category_id" className="form-label">
            Category
          </label>
          <select
            className="form-select"
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Update;
